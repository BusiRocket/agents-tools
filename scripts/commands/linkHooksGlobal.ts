import { cp, mkdir, rm } from "node:fs/promises"
import path from "node:path"
import { CANONICAL_HOOKS_DIR } from "../lib/link/constants/CANONICAL_HOOKS_DIR"
import { HOOKS_DIST_DIR } from "./constants/HOOKS_DIST_DIR"

/**
 * Copy built hooks into the canonical hooks directory, mirroring skills:link.
 *
 * Hooks reach Claude Code only through settings.json or an installed plugin, and
 * pointing either at a repo path makes them silently dead the moment the repo
 * moves. Settings should reference ~/.agents/hooks/<name> instead.
 */
export const main = async () => {
  await rm(CANONICAL_HOOKS_DIR, { recursive: true, force: true })
  await mkdir(path.dirname(CANONICAL_HOOKS_DIR), { recursive: true })
  await cp(HOOKS_DIST_DIR, CANONICAL_HOOKS_DIR, { recursive: true })
  console.log(`Hooks -> ${CANONICAL_HOOKS_DIR}`)
  console.log("Point ~/.claude/settings.json at that path so hooks survive a repo move.")
}
