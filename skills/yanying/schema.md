# 故事格式

```json
{
  "title": "把月光送回家",
  "duration": 5,
  "characters": [{"id":"snail","description":"背着金色圆壳的小蜗牛"}],
  "shots": [{
    "duration":5,
    "visual":"背着金色圆壳的小蜗牛终于回到温暖的小屋。",
    "characterIds":["snail"],
    "caption":"小蜗牛终于回到了温暖的家。",
    "asset":"assets/home.png"
  }]
}
```

所有字段必填，唯独 audio 可选（如 `"audio":"assets/narration.wav"`）。总时长 2—120 秒；1—24 镜，每镜 1—30 秒，各镜合计必须等于 duration。字幕每镜 1—48 字且不含换行等控制字符，总字数至少为 duration × 1.5；超过每秒 5 字会提示阅读过快。characters 可为空数组，非空角色描述至少 4 字。图片支持 PNG/JPG/WebP，视频支持 MP4/MOV/WebM，声音支持 WAV/MP3/M4A。

图片按镜头时长展示；视频不足镜头时长时循环，超出则截断。成片固定 1280×720、25fps，等比缩放并补边，画面不裁切。不提供用户自定义 FFmpeg 参数或滤镜。
