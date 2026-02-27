/**
 * Link Codex global rules: AGENTS.md and codex/rules/default.rules to ~/.codex.
 */
import os from "node:os"
import path from "node:path"
import { runLinkScript } from "./lib/link/runLinkScript.mjs"

const ROOT = process.cwd()
const HOME = os.homedir()

const links = [
  { source: path.join(ROOT, "AGENTS.md"), target: path.join(HOME, ".codex", "AGENTS.md") },
  {
    source: path.join(ROOT, "codex", "rules", "default.rules"),
    target: path.join(HOME, ".codex", "rules", "default.rules"),
  },
]

const main = async () => {
  await runLinkScript(links, "Codex global links are ready. Restart Codex to reload.")
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
