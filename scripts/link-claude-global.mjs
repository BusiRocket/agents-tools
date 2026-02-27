/**
 * Link Claude global rules: CLAUDE.md and .claude/rules to ~/.claude.
 */
import os from "node:os"
import path from "node:path"
import { runLinkScript } from "./lib/link/runLinkScript.mjs"

const ROOT = process.cwd()
const HOME = os.homedir()

const links = [
  {
    source: path.join(ROOT, "dist", "markdown", "CLAUDE.md"),
    target: path.join(HOME, ".claude", "CLAUDE.md"),
  },
  {
    source: path.join(ROOT, "dist", "global", ".claude", "rules"),
    target: path.join(HOME, ".claude", "rules", "busirocket"),
  },
]

const main = async () => {
  await runLinkScript(links, "Claude global links are ready. Restart Claude Code to reload.")
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
