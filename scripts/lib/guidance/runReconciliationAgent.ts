import { spawn } from "node:child_process"
import { mkdtemp, rm } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { createSandboxCommand } from "./createSandboxCommand"
import type { GuidancePolicy } from "./types/GuidancePolicy"

export const runReconciliationAgent = async (
  policy: GuidancePolicy,
  prompt: string,
): Promise<unknown> =>
  await (async () => {
    const scratchDir = await mkdtemp(join(tmpdir(), "guidance-agent-"))
    try {
      return await new Promise((resolve, reject) => {
        const [command, ...args] = policy.agentCommand
        if (command === undefined) {
          reject(new Error("agent command is empty"))
          return
        }
        if (!command.startsWith("/")) {
          reject(new Error("agent command must be an absolute executable path"))
          return
        }
        const sandbox = createSandboxCommand({
          platform: process.platform,
          scratchDir,
          command,
          args,
        })
        const child = spawn(sandbox.executable, sandbox.args, {
          cwd: "/",
          env: {
            PATH: "/usr/bin:/bin:/usr/sbin:/sbin",
            HOME: "/nonexistent",
            LANG: "C",
            LC_ALL: "C",
            NO_COLOR: "1",
            TMPDIR: scratchDir,
          },
          stdio: ["pipe", "pipe", "pipe"],
          shell: false,
        })
        const chunks: Buffer[] = []
        let bytes = 0
        let errorBytes = 0
        const timer = setTimeout(() => child.kill("SIGKILL"), policy.timeoutMs)
        child.stdout.on("data", (chunk: Buffer) => {
          bytes += chunk.length
          if (bytes > policy.maxOutputBytes) child.kill("SIGKILL")
          else chunks.push(chunk)
        })
        child.stderr.on("data", (chunk: Buffer) => {
          errorBytes += chunk.length
          if (errorBytes > policy.maxOutputBytes) child.kill("SIGKILL")
        })
        child.on("error", reject)
        child.on("close", (code) => {
          clearTimeout(timer)
          if (bytes > policy.maxOutputBytes) {
            reject(new Error("agent output exceeded configured byte limit"))
            return
          }
          if (errorBytes > policy.maxOutputBytes) {
            reject(new Error("agent stderr exceeded configured byte limit"))
            return
          }
          if (code !== 0) {
            reject(
              new Error(
                `agent exited with code ${String(code)}; stderr bytes: ${String(errorBytes)}`,
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
    } finally {
      await rm(scratchDir, { recursive: true, force: true })
    }
  })()
