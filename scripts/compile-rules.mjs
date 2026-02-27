/**
 * Compile rules: generate .cursor/rules, .claude/rules, .agent/rules, .windsurf/rules,
 * CLAUDE.md, AGENTS.md, GEMINI.md, WINDSURF.md from rules/*.mdc.
 * With --check: exit 1 if any output is missing or outdated.
 */
import { promises as fs } from "node:fs"
import path from "node:path"
import { listFilesRecursive } from "./lib/fs/listFilesRecursive.mjs"
import { readIfExists } from "./lib/fs/readIfExists.mjs"
import { checkClaudeRules } from "./lib/rules/checkClaudeRules.mjs"
import { checkCursorRules } from "./lib/rules/checkCursorRules.mjs"
import { checkAntigravityRules } from "./lib/rules/checkAntigravityRules.mjs"
import { checkWindsurfRules } from "./lib/rules/checkWindsurfRules.mjs"
import { generateBundle } from "./lib/rules/generateBundle.mjs"
import { renderAgents } from "./lib/rules/renderAgents.mjs"
import { renderClaude } from "./lib/rules/renderClaude.mjs"
import { renderAntigravity } from "./lib/rules/renderAntigravity.mjs"
import { renderWindsurf } from "./lib/rules/renderWindsurf.mjs"
import { syncClaudeRules } from "./lib/rules/syncClaudeRules.mjs"
import { syncCursorRules } from "./lib/rules/syncCursorRules.mjs"
import { syncAntigravityRules } from "./lib/rules/syncAntigravityRules.mjs"
import { syncWindsurfRules } from "./lib/rules/syncWindsurfRules.mjs"

const ROOT = process.cwd()
const SOURCE_DIR = path.join(ROOT, "rules", "source")
const CURSOR_DIR = path.join(ROOT, ".cursor", "rules")
const CLAUDE_RULES_DIR = path.join(ROOT, ".claude", "rules")
const ANTIGRAVITY_DIR = path.join(ROOT, ".agent", "rules")
const WINDSURF_DIR = path.join(ROOT, ".windsurf", "rules")
const CLAUDE_PATH = path.join(ROOT, "CLAUDE.md")
const AGENTS_PATH = path.join(ROOT, "AGENTS.md")
const GEMINI_PATH = path.join(ROOT, "GEMINI.md")
const WINDSURF_PATH = path.join(ROOT, "WINDSURF.md")

const main = async () => {
  const checkOnly = process.argv.includes("--check")

  let sourceFiles = []
  try {
    sourceFiles = await listFilesRecursive(SOURCE_DIR)
  } catch {
    console.error("Missing rules source directory: /rules")
    process.exit(1)
  }

  const bundle = await generateBundle(sourceFiles, SOURCE_DIR)
  const nextClaude = renderClaude(bundle)
  const nextAgents = renderAgents(bundle)
  const nextGemini = renderAntigravity(bundle)
  const nextWindsurf = renderWindsurf(bundle)

  if (checkOnly) {
    const errors = [
      ...(await checkCursorRules(sourceFiles, SOURCE_DIR, CURSOR_DIR)),
      ...(await checkClaudeRules(sourceFiles, SOURCE_DIR, CLAUDE_RULES_DIR)),
      ...(await checkAntigravityRules(sourceFiles, SOURCE_DIR, ANTIGRAVITY_DIR)),
      ...(await checkWindsurfRules(sourceFiles, SOURCE_DIR, WINDSURF_DIR)),
    ]

    const currentClaude = await readIfExists(CLAUDE_PATH)
    const currentAgents = await readIfExists(AGENTS_PATH)
    const currentGemini = await readIfExists(GEMINI_PATH)
    const currentWindsurf = await readIfExists(WINDSURF_PATH)

    if (currentClaude !== nextClaude) {
      errors.push("Outdated generated file: CLAUDE.md")
    }

    if (currentAgents !== nextAgents) {
      errors.push("Outdated generated file: AGENTS.md")
    }

    if (currentGemini !== nextGemini) {
      errors.push("Outdated generated file: GEMINI.md")
    }

    if (currentWindsurf !== nextWindsurf) {
      errors.push("Outdated generated file: WINDSURF.md")
    }

    if (errors.length > 0) {
      console.error("Rules are not compiled or are out of date:\n")
      for (const error of errors) {
        console.error(`- ${error}`)
      }
      process.exit(1)
    }

    console.log("Rules are up to date.")
    return
  }

  await syncCursorRules(sourceFiles, SOURCE_DIR, CURSOR_DIR)
  await syncClaudeRules(sourceFiles, SOURCE_DIR, CLAUDE_RULES_DIR)
  await syncAntigravityRules(sourceFiles, SOURCE_DIR, ANTIGRAVITY_DIR)
  await syncWindsurfRules(sourceFiles, SOURCE_DIR, WINDSURF_DIR)
  await fs.writeFile(CLAUDE_PATH, nextClaude, "utf8")
  await fs.writeFile(AGENTS_PATH, nextAgents, "utf8")
  await fs.writeFile(GEMINI_PATH, nextGemini, "utf8")
  await fs.writeFile(WINDSURF_PATH, nextWindsurf, "utf8")

  console.log("Compiled rules for Cursor, Claude, Codex, Antigravity (Gemini), and Windsurf.")
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
