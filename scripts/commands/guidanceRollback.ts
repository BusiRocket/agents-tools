import { homedir } from "node:os"
import { join, resolve } from "node:path"
import { guidanceRollback } from "../lib/guidance/guidanceRollback"

export const main = async (): Promise<void> => {
  const value = (name: string): string | undefined => {
    const index = process.argv.indexOf(name)
    return index === -1 ? undefined : process.argv[index + 1]
  }
  const home = value("--home") ?? homedir()
  const canonicalDir =
    value("--canonical-dir") ?? join(home, ".config", "rocket-agents", "agent-guidance")
  const stateDir =
    value("--state-dir") ?? join(home, ".local", "state", "rocket-agents", "guidance", "default")
  const requestedRun = value("--to")
  const report = await guidanceRollback({
    home: resolve(home),
    canonicalDir: resolve(canonicalDir),
    stateDir: resolve(stateDir),
    ...(requestedRun === undefined ? {} : { runId: requestedRun }),
  })
  console.log(JSON.stringify(report, null, 2))
  if (!report.ok) process.exitCode = 1
}
