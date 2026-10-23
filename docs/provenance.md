# 开源来源与二次开发记录

本版为精简派生版，提取可独立运行的制作基础层；不是完整 fork UI 换皮，也不是此前 hostProbe 的包装。

上游：[HBAI-Ltd/Toonflow-app](https://github.com/HBAI-Ltd/Toonflow-app)，固定提交 `30139c931e80476caa718b31684b86383c6e83ce`，MIT，Copyright (c) 2026 HBAI-Ltd。

| 本仓库文件 | 上游文件 | 使用方式与修改 |
|---|---|---|
| packages/file/src/index.ts | packages/file/src/index.ts | 复用文件读写、原子写入、访问协调；环境变量前缀改为 YANYING |
| packages/file/src/access.ts | packages/file/src/access.ts | 直接复用文件访问锁与协调 |
| packages/file/src/bun.ts | packages/file/src/bun.ts | 保留上游 Bun 文件适配，错误提示中的包名改为 @yanying/file |
| packages/file/src/renameExclusive.ts | packages/file/src/renameExclusive.ts | 保留上游跨平台排他改名实现 |
| packages/ffmpeg/src/runtime.ts | packages/ffmpeg/src/runtime.ts | 实际渲染时调用其 createFfmpeg；限制显式输入输出在工作目录内，包引用改为 @yanying/file |

新增：故事 schema 与语义校验；图片/视频统一规格、字幕烧录、配音合成；输出状态；MCP 三个工具；CLI；安装脚本；WorkBuddy Skill；20 秒原创插画示例及教程。

没有复制上游品牌图片、赞助广告、界面或名称作为言映产品标识。版权、许可证及来源说明中的项目名保留，避免误导来源或遗漏许可义务。包命名空间使用 @yanying。

MoneyPrinterTurbo 本版没有复制模块。其素材搜索等能力需要网络服务和额外依赖，留待后续验证后再接入，不把“调研参考”写成“代码复用”。

上游文件不会在安装时动态拉取；版本固定在本仓库。更新时需重新检查上游变化、许可证与路径安全行为。
