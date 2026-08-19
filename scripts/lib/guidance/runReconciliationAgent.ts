import { spawn } from "node:child_process"
import type { GuidancePolicy } from "./types/GuidancePolicy"

export const runReconciliationAgent = async (
  policy: GuidancePolicy,
  prompt: string,
): Promise<unknown> =>
  await new Promise((resolve, reject) => {
    const [command, ...args] = policy.agentCommand
    if (command === undefined) {
      reject(new Error("agent command is empty"))
      return
    }
    const child = spawn(command, args, { stdio: ["pipe", "pipe", "pipe"], shell: false })
    const chunks: Buffer[] = []
    const errors: Buffer[] = []
    let bytes = 0
    const timer = setTimeout(() => child.kill("SIGKILL"), policy.timeoutMs)
    child.stdout.on("data", (chunk: Buffer) => {
      bytes += chunk.length
      if (bytes > policy.maxOutputBytes) child.kill("SIGKILL")
      else chunks.push(chunk)
    })
    child.stderr.on("data", (chunk: Buffer) => errors.push(chunk))
    child.on("error", reject)
    child.on("close", (code) => {
      clearTimeout(timer)
      if (bytes > policy.maxOutputBytes) {
        reject(new Error("agent output exceeded configured byte limit"))
        return
      }
      if (code !== 0) {
        reject(
          new Error(
            `agent exited with code ${String(code)}: ${Buffer.concat(errors).toString("utf8").slice(0, 500)}`,
          ),
        )
        return
      }
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString("utf8")))
      } catch {
        reject(new Error("agent returned invalid JSON"))
      }
    })
    child.stdin.end(prompt)
  })
