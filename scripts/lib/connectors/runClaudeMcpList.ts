import { spawn } from "node:child_process"

export const runClaudeMcpList = (
  profile: "claude-personal" | "claude-favish",
  home: string,
): Promise<string> =>
  new Promise((resolve, reject) => {
    const env = {
      ...process.env,
      ...(profile === "claude-favish" ? { CLAUDE_CONFIG_DIR: `${home}/.claude-favish` } : {}),
    }
    const child = spawn("claude", ["mcp", "list"], { env, shell: false })
    let output = ""
    child.stdout.on("data", (chunk: Buffer) => {
      output = `${output}${chunk.toString()}`.slice(-65_536)
    })
    child.stderr.on("data", (chunk: Buffer) => {
      output = `${output}${chunk.toString()}`.slice(-65_536)
    })
    child.on("error", reject)
    child.on("close", () => {
      resolve(output)
    })
  })
