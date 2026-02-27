#!/usr/bin/env node
/**
 * Link Windsurf global rules: copy WINDSURF.md to ~/.windsurf/rules/global.md.
 */
import path from "node:path"
import os from "node:os"
import { copyFileToGlobal } from "./lib/link/copyFileToGlobal.mjs"

const HOME = os.homedir()
const WINDSURF_GLOBAL_DIR = path.join(HOME, ".windsurf", "rules")
const LOCAL_WINDSURF = path.join(process.cwd(), "WINDSURF.md")

const main = async () => {
  const { globalPath } = await copyFileToGlobal(
    LOCAL_WINDSURF,
    WINDSURF_GLOBAL_DIR,
    "global.md",
    "WINDSURF.md",
  )
  console.log(`Linked to Windsurf global rules: ${globalPath}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
