import { spawn } from "node:child_process"
import type { StdioMcpProbeResult } from "./types/StdioMcpProbeResult"

export const probeStdioMcp = (
  command: string,
  args: string[],
  timeoutMs = 5_000,
): Promise<StdioMcpProbeResult> =>
  new Promise((resolve) => {
    const startedAt = performance.now()
    const child = spawn(command, args, { shell: false, stdio: ["pipe", "pipe", "ignore"] })
    let buffer = ""
    let finished = false
    const finish = (status: StdioMcpProbeResult["status"], summary: string) => {
      if (finished) return
      finished = true
      clearTimeout(timeout)
      child.kill()
      resolve({
        status,
        boundary: "client",
        durationMs: Math.round(performance.now() - startedAt),
        summary,
      })
    }
    const timeout = setTimeout(() => {
      finish("failed", "MCP startup probe timed out")
    }, timeoutMs)
    child.on("error", () => {
      finish("failed", "MCP process failed to start")
    })
    child.on("close", (code) => {
      if (!finished) {
        finish("failed", code === 0 ? "MCP process exited" : "MCP process failed")
      }
    })
    child.stdout.on("data", (chunk: Buffer) => {
      buffer = `${buffer}${chunk.toString()}`
      if (buffer.length > 65_536) {
        finish("failed", "MCP startup probe response exceeded limit")
        return
      }
      const lines = buffer.split("\n")
      buffer = lines.pop() ?? ""
      for (const line of lines) {
        try {
          const response = JSON.parse(line) as { id?: string; result?: { tools?: unknown } }
          if (response.id === "connector-doctor-initialize" && response.result !== undefined) {
            child.stdin.write(
              `${JSON.stringify({
                jsonrpc: "2.0",
                id: "connector-doctor-tools-list",
                method: "tools/list",
                params: {},
              })}\n`,
            )
          }
          if (
            response.id === "connector-doctor-tools-list" &&
            Array.isArray(response.result?.tools)
          ) {
            finish("healthy", "MCP initialize and tools/list succeeded")
          }
        } catch {
          continue
        }
      }
    })
    child.stdin.write(
      `${JSON.stringify({
        jsonrpc: "2.0",
        id: "connector-doctor-initialize",
        method: "initialize",
        params: {
          protocolVersion: "2025-06-18",
          capabilities: {},
          clientInfo: { name: "rocket-agents-connector-doctor", version: "1.0.0" },
        },
      })}\n`,
    )
  })
