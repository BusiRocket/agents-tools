import { homedir } from "node:os"
import { join, resolve } from "node:path"
import { guidanceSync } from "../lib/guidance/guidanceSync"

export const main = async (): Promise<void> => {
  const argumentValue = (name: string): string | undefined => {
    const index = process.argv.indexOf(name)
    return index === -1 ? undefined : process.argv[index + 1]
  }
  const home = argumentValue("--home") ?? homedir()
  const canonicalDir =
    argumentValue("--canonical-dir") ?? join(home, ".config", "rocket-agents", "agent-guidance")
  const stateDir =
    argumentValue("--state-dir") ??
    join(home, ".local", "state", "rocket-agents", "guidance", "default")
  const rulesInventory = argumentValue("--rules-inventory")
  const report = await guidanceSync({
    home: resolve(home),
    canonicalDir: resolve(canonicalDir),
    stateDir: resolve(stateDir),
    ...(rulesInventory === undefined ? {} : { rulesInventoryPath: resolve(rulesInventory) }),
  })
  console.log(JSON.stringify(report, null, 2))
  if (!report.ok) process.exitCode = 1
}
