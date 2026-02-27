#!/usr/bin/env node
/**
 * Link Cursor global skills: clean stale busirocket-* skills, then symlink from src/skills/stacks/.
 */
import { promises as fs } from "node:fs"
import os from "node:os"
import path from "node:path"
import { cleanGlobalPrefix } from "./lib/link/cleanGlobalPrefix.mjs"
import { ensureParentDirectory } from "./lib/link/ensureParentDirectory.mjs"
import { linkOneWithBackup } from "./lib/link/linkOneWithBackup.mjs"

const ROOT = process.cwd()
const HOME = os.homedir()
const PREFIX = "busirocket-"
const SKILLS_SOURCE_DIR = path.join(ROOT, "src", "skills", "stacks")
const CURSOR_SKILLS_DIR = path.join(HOME, ".cursor", "skills")

const main = async () => {
  await ensureParentDirectory(path.join(CURSOR_SKILLS_DIR, "_"))

  const removed = await cleanGlobalPrefix(CURSOR_SKILLS_DIR, PREFIX)
  if (removed.length > 0) {
    console.log(`Cleaned ${removed.length} stale skill(s): ${removed.join(", ")}`)
  }

  const entries = await fs.readdir(SKILLS_SOURCE_DIR, { withFileTypes: true })
  const skillDirs = entries
    .filter((entry) => entry.isDirectory() && entry.name.startsWith(PREFIX))
    .map((entry) => entry.name)

  if (skillDirs.length === 0) {
    console.log("No busirocket-* skills found in src/skills/stacks/.")
    return
  }

  for (const skillName of skillDirs) {
    const source = path.join(SKILLS_SOURCE_DIR, skillName)
    const target = path.join(CURSOR_SKILLS_DIR, skillName)
    const result = await linkOneWithBackup({ source, target })

    if (result.status === "unchanged") {
      console.log(`= ${skillName} already linked`)
    } else {
      console.log(`+ Linked ${skillName}`)
    }
  }

  console.log(
    `\nCursor global skills are ready (${skillDirs.length} skills). Restart Cursor to reload.`,
  )
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
