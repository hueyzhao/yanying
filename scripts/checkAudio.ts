// Regression checks for audio compatibility, boundaries and offline accompaniment.
import { strict as assert } from "node:assert";
import { mkdir, mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import ffmpeg from "ffmpeg-static";
import { prepareAudio, requireVoice, voiceStatus } from "../src/audio";
import { validateStory } from "../src/story";

const base = { title: "音频校验", duration: 4, characters: [], shots: [{ duration: 4, visual: "安静的小屋亮着暖灯", characterIds: [], caption: "欢迎回到温暖的小屋。", asset: "test.png" }] };
assert.throws(() => validateStory({ ...base, audio: "x.wav", voiceover: {} }), /只能选一个/);
assert.throws(() => validateStory({ ...base, music: { preset: "gentle", asset: "x.wav" } }));
assert.throws(() => validateStory({ ...base, music: { preset: "gentle", volume: -1 } }));
const root = await mkdtemp(join(tmpdir(), "yanyingAudioCheck-"));
let checks = 3;
try {
  for (const preset of ["gentle", "bright", "calm"] as const) {
    const dir = join(root, preset); await mkdir(dir, { recursive: true });
    const { story } = validateStory({ ...base, music: { preset } });
    const result = await prepareAudio(story, dir, ffmpeg!, async () => { throw new Error("unexpected external file"); });
    const raw = Bun.spawn([ffmpeg!, "-v", "error", "-i", result.file!, "-f", "s16le", "-ac", "1", "-ar", "24000", "pipe:1"], { stdout: "pipe", stderr: "pipe" });
    const [data, error, code] = await Promise.all([new Response(raw.stdout).arrayBuffer(), new Response(raw.stderr).text(), raw.exited]);
    assert.equal(code, 0, error); assert.equal(data.byteLength, 4 * 24000 * 2);
    const pcm = Buffer.from(data); let max = 0;
    for (let i = 0; i < pcm.length; i += 2) max = Math.max(max, Math.abs(pcm.readInt16LE(i)));
    assert(max > 50 && max < 32767, "music must be non-silent and unclipped"); checks++;
  }
  const dir = join(root, "legacy"); await mkdir(dir, { recursive: true });
  const { story } = validateStory({ ...base, audio: "own.wav", music: { preset: "calm" } });
  const result = await prepareAudio(story, dir, ffmpeg!, async path => { assert.equal(path, "own.wav"); return join(root, "gentle/music.wav"); });
  assert(result.file); assert.equal(result.details.ducking, true); checks++;
  const silent = await prepareAudio(validateStory(base).story, dir, ffmpeg!, async () => "");
  assert.equal(silent.file, undefined); checks++;
  assert((await readFile(result.file)).byteLength > 1000);
  const imported = join(root, "imported"); await mkdir(imported);
  const longer = { ...base, duration: 6, shots: base.shots.map(shot => ({ ...shot, duration: 6 })) };
  const importedResult = await prepareAudio(validateStory({ ...longer, music: { asset: "short.wav" } }).story, imported, ffmpeg!, async () => join(root, "gentle/music.wav"));
  assert(importedResult.file); checks++;
  await assert.rejects(requireVoice("yanying_missing_voice_123")); checks++;
  if ((await voiceStatus()).available) {
    const overflow = join(root, "overflow"); await mkdir(overflow);
    const tooLong = { ...base, voiceover: {}, shots: base.shots.map(shot => ({ ...shot, narration: "小蜗牛在黑暗中迷路了，萤火虫飞来，陪它穿过草地，越过小溪，寻找温暖的小屋，它们决定以后每个夜晚都要一起散步。" })) };
    await assert.rejects(prepareAudio(validateStory(tooLong).story, overflow, ffmpeg!, async () => ""), /不会截断台词/); checks++;
  }
  console.log(`${checks} audio regression checks passed`);
} finally { await rm(root, { recursive: true, force: true }); }
