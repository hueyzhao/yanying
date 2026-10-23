import { z } from "zod";

export const storySchema = z.object({
  title: z.string().trim().min(1).max(80),
  duration: z.number().int().min(2).max(120),
  characters: z.array(z.object({ id: z.string().min(1).max(32), description: z.string().min(4).max(300) }).strict()).max(8),
  shots: z.array(z.object({
    duration: z.number().min(1).max(30),
    visual: z.string().min(4).max(600),
    characterIds: z.array(z.string()).max(8),
    caption: z.string().trim().min(1).max(48).refine(value => !/[\x00-\x1f\x7f]/.test(value), "字幕不能含控制字符"),
    asset: z.string().min(1).max(500),
  }).strict()).min(1).max(24),
  audio: z.string().min(1).max(500).optional(),
}).strict();
export type Story = z.infer<typeof storySchema>;

export function validateStory(input: unknown) {
  const story = storySchema.parse(input);
  const ids = new Set(story.characters.map(item => item.id));
  if (ids.size !== story.characters.length) throw new Error("角色 ID 不能重复");
  const total = story.shots.reduce((sum, shot) => sum + shot.duration, 0);
  if (Math.abs(total - story.duration) > 0.001) throw new Error(`分镜合计 ${total} 秒，与目标 ${story.duration} 秒不符`);
  for (const [index, shot] of story.shots.entries()) {
    for (const id of shot.characterIds) {
      if (!ids.has(id)) throw new Error(`第 ${index + 1} 镜引用未知角色 ${id}`);
      const description = story.characters.find(item => item.id === id)!.description;
      if (!shot.visual.includes(description)) throw new Error(`第 ${index + 1} 镜缺少角色 ${id} 的完整描述`);
    }
  }
  const captionCount = story.shots.reduce((sum, shot) => sum + [...shot.caption].length, 0);
  if (captionCount < Math.ceil(story.duration * 1.5)) throw new Error("字幕总字数不足：每秒至少 1.5 字，请补齐剧情");
  const warnings = story.shots.flatMap((shot, index) => [...shot.caption].length / shot.duration > 5 ? [`第 ${index + 1} 镜字幕超过每秒 5 字，阅读可能过快`] : []);
  return { story, warnings };
}
