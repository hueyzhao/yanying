import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { doctor, renderProject, validateProject } from "./maker";

const server = new McpServer({ name: "yanying", version: "0.1.0" });
async function result(operation: () => Promise<unknown>) {
  try { return { content: [{ type: "text" as const, text: JSON.stringify(await operation()) }] }; }
  catch (error) { return { isError: true, content: [{ type: "text" as const, text: error instanceof Error ? error.message : String(error) }] }; }
}
server.tool("yanying_status", "检查言映本地工具、工作目录和 FFmpeg，不联网、不收费", {}, () => result(doctor));
server.tool("yanying_validate", "校验故事时长、角色描述、字幕字数及本地素材；不渲染", { storyPath: z.string().min(1) }, ({ storyPath }) => result(() => validateProject(storyPath)));
server.tool("yanying_render", "使用工作目录内的图片或视频、字幕和可选音频生成本地 MP4；不调用生成 API。最长 120 秒，可能需要数分钟", { storyPath: z.string().min(1) }, ({ storyPath }) => result(() => renderProject(storyPath)));
await server.connect(new StdioServerTransport());
