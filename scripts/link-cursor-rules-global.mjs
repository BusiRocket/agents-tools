#!/usr/bin/env node
/**
 * Link Cursor global rules: clean stale busirocket-* rules, then symlink compiled rules directory.
 */
import os from "node:os"
import path from "node:path"
import { cleanGlobalPrefix } from "./lib/link/cleanGlobalPrefix.mjs"
import { runLinkScript } from "./lib/link/runLinkScript.mjs"

const ROOT = process.cwd()
const HOME = os.homedir()
const PREFIX = "busirocket-"
const CURSOR_RULES_DIR = path.join(HOME, ".cursor", "rules")

const main = async () => {
  const removed = await cleanGlobalPrefix(CURSOR_RULES_DIR, PREFIX)
  if (removed.length > 0) {
    console.log(`Cleaned ${removed.length} stale rule(s): ${removed.join(", ")}`)
  }

  const links = [
    {
      source: path.join(ROOT, "dist", "global", ".cursor", "rules"),
      target: path.join(CURSOR_RULES_DIR, "busirocket"),
    },
  ]

  await runLinkScript(links, "Cursor global rules are ready. Restart Cursor to reload.")
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
