# 言映 Yanying

让 WorkBuddy 写故事，让电脑在本地把素材做成视频。

**0.1.0 是可运行的本地制作首版，不是完整 AI 漫剧平台。** 基于 Toonflow 的文件操作层和 FFmpeg 工作区封装二次开发，提供 Skill、MCP 和 CLI。用户界面与技能均使用言映品牌；原作者版权与来源保留在 LICENSE 和 [来源说明](docs/provenance.md)。没有引入 MoneyPrinterTurbo 代码，也不声称完成整套 Toonflow 画布移植。

![原创示例四镜预览](docs/preview.png)

## 能做什么

- 把本地 PNG/JPG/WebP 图片、MP4/MOV/WebM 视频按分镜合成为 MP4。
- 固定输出 720p / 25fps，等比缩放补边，烧录中文字幕并导出 SRT。
- 自动检查总时长、角色描述是否遗漏、字幕总字数、素材是否存在及目录边界。
- 支持一条用户提供的 WAV/MP3/M4A 配音或配乐；未提供声音时输出无声视频。素材原声会被移除。
- 使用 WorkBuddy 自身模型，不需要下载 Qwen、Whisper 或视频大模型。本地制作没有付费 API 调用；宿主模型额度不由本工具控制。

## 安装和使用

完整图文步骤见 [WorkBuddy 安装使用教程](docs/workbuddy.md)。

下载源码 ZIP 并解压到固定位置。macOS 可运行 `bash install.command`；Windows 使用 PowerShell 运行 `./install.ps1`。脚本会在缺失时安装 Bun，并下载依赖和 FFmpeg，**首次安装需要联网**。安装失败会停止，不会静默切换付费服务。

已经安装 Bun 的用户：

```sh
bun install --frozen-lockfile
bun run setup
bun run demo
```

安装生成的 `local/mcp.json` 含本机绝对路径，导入 WorkBuddy 后，把 `skills/yanying` 打包为 ZIP，使用 WorkBuddy 的「上传技能」导入。文件夹移动后重新执行 setup 并更新 MCP。

## 命令行

```sh
bun start doctor
bun start validate demo/story.json
bun start render demo/story.json
```

默认工作目录是启动目录下的 `workspace/`，MCP 配置会固定它。自定义目录设置 `YANYING_WORKSPACE`。故事数据格式见 [schema](skills/yanying/schema.md)。工具结果包含真实输出文件路径，不固定覆盖 `final.mp4`。

## 首版限制

- 无文生图、文生视频、自动配音、素材网站下载、无限画布或付费 API 适配器。示例是原创静态二维插画故事片，不是连续角色动画。
- 宿主必须能运行本地进程。纯云端付费技能是否可连接用户电脑，尚未验证；本版本面向本地手动安装。
- 一次最多 120 秒、24 镜；同一进程串行制作。失败输出保留用于排查，没有自动付费重试。
- macOS Intel 有实际运行验证；Windows / Apple Silicon / Linux 为源码兼容目标，未做真机验收，不承诺所有电脑一键成功。
- 中文字幕需要本机中文字体。macOS 默认苹方，Windows 默认微软雅黑，Linux 默认 Noto CJK；找不到时设置 `YANYING_FONT`。不随项目分发系统字体。
- FFmpeg 默认由 ffmpeg-static 安装；也可设置 `YANYING_FFMPEG` 指向自己安装的程序。分发 FFmpeg 二进制时应遵守该构建的许可及源码提供要求，本仓库不提交二进制。

## 开发

```sh
bun run typecheck
```

目录：`src/` 是言映编排及 MCP；`packages/file`、`packages/ffmpeg` 是实际复用并修改命名的上游代码；`scripts/` 是安装配置和原创示例；`skills/` 是宿主使用说明。

安全边界：工具仅接受工作目录内的素材相对路径，不接受任意 shell 或 FFmpeg 参数；符号链接越界也拒绝。不要把工作目录设置为整个用户主目录。FFmpeg 包装层不是操作系统沙箱，建议仅导入可信媒体文件。

本项目采用 MIT 许可证，保留上游 HBAI-Ltd 版权声明；新增言映代码同样采用 MIT。
