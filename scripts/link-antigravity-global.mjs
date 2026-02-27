#!/usr/bin/env node
/**
 * Link Antigravity (Gemini) global rules: copy GEMINI.md to ~/.gemini/GEMINI.md.
 */
import os from "node:os"
import path from "node:path"
import { copyFileToGlobal } from "./lib/link/copyFileToGlobal.mjs"

const HOME = os.homedir()
const ANTIGRAVITY_GLOBAL_DIR = path.join(HOME, ".gemini")
const LOCAL_GEMINI = path.join(process.cwd(), "dist", "markdown", "GEMINI.md")

const main = async () => {
  const { globalPath } = await copyFileToGlobal(
    LOCAL_GEMINI,
    ANTIGRAVITY_GLOBAL_DIR,
    "GEMINI.md",
    "GEMINI.md",
  )
  console.log(`Linked to Antigravity global rules: ${globalPath}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
