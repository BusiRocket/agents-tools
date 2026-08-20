import { spawn } from "node:child_process"

export const runCodexMcpList = (): Promise<string> =>
  new Promise((resolve, reject) => {
    const child = spawn("codex", ["mcp", "list", "--json"], { shell: false })
    let output = ""
    child.stdout.on("data", (chunk: Buffer) => {
      output = `${output}${chunk.toString()}`.slice(-65_536)
    })
    child.stderr.resume()
    child.on("error", reject)
    child.on("close", () => {
      resolve(output)
    })
  })
