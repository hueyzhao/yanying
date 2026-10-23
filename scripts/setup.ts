import { mkdir, writeAtomic } from "@yanying/file";
import { resolve, join } from "node:path";
import { doctor, workspace } from "../src/maker";

const root = resolve(import.meta.dir, "..");
await mkdir(workspace, { recursive: true });
await mkdir(join(root, "local"), { recursive: true });
const configuration = { mcpServers: { yanying: {
  type: "stdio",
  command: process.execPath,
  args: [join(root, "src", "mcp.ts")],
  env: { YANYING_WORKSPACE: workspace },
  timeout: 300000,
} } };
await doctor();
await writeAtomic(join(root, "local", "mcp.json"), JSON.stringify(configuration, null, 2));
console.log(`言映安装完成。\n工作目录：${workspace}\nWorkBuddy MCP 配置：${join(root, "local", "mcp.json")}\n技能目录：${join(root, "skills", "yanying")}\n请按 docs/workbuddy.md 完成导入。`);
