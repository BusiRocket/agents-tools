/**
 * Compile rules: generate .cursor/rules, .claude/rules, .agent/rules, .windsurf/rules,
 * CLAUDE.md, AGENTS.md, GEMINI.md, WINDSURF.md from rules/*.mdc.
 * With --check: exit 1 if any output is missing or outdated.
 */
import { promises as fs } from "node:fs"
import path from "node:path"
import { listFilesRecursive } from "./lib/fs/listFilesRecursive.mjs"
import { readIfExists } from "./lib/fs/readIfExists.mjs"
import { checkAntigravityRules } from "./lib/rules/checkAntigravityRules.mjs"
import { checkClaudeRules } from "./lib/rules/checkClaudeRules.mjs"
import { checkCursorRules } from "./lib/rules/checkCursorRules.mjs"
import { checkWindsurfRules } from "./lib/rules/checkWindsurfRules.mjs"
import { generateBundle } from "./lib/rules/generateBundle.mjs"
import { renderAgents } from "./lib/rules/renderAgents.mjs"
import { renderAntigravity } from "./lib/rules/renderAntigravity.mjs"
import { renderAllRules } from "./lib/rules/renderAllRules.mjs"
import { renderClaudeIndexOnly } from "./lib/rules/renderClaudeIndexOnly.mjs"
import { renderWindsurf } from "./lib/rules/renderWindsurf.mjs"
import { syncAntigravityRules } from "./lib/rules/syncAntigravityRules.mjs"
import { syncClaudeRules } from "./lib/rules/syncClaudeRules.mjs"
import { syncCursorRules } from "./lib/rules/syncCursorRules.mjs"
import { syncWindsurfRules } from "./lib/rules/syncWindsurfRules.mjs"

const ROOT = process.cwd()
const SOURCE_DIR = path.join(ROOT, "src", "rules")
const CURSOR_DIR = path.join(ROOT, "dist", "global", ".cursor", "rules")
const CLAUDE_RULES_DIR = path.join(ROOT, "dist", "global", ".claude", "rules")
const ANTIGRAVITY_DIR = path.join(ROOT, "dist", "global", ".agent", "rules")
const WINDSURF_DIR = path.join(ROOT, "dist", "global", ".windsurf", "rules")
const CLAUDE_PATH = path.join(ROOT, "dist", "markdown", "CLAUDE.md")
const AGENTS_PATH = path.join(ROOT, "dist", "markdown", "AGENTS.md")
const GEMINI_PATH = path.join(ROOT, "dist", "markdown", "GEMINI.md")
const WINDSURF_PATH = path.join(ROOT, "dist", "markdown", "WINDSURF.md")
const ALL_RULES_PATH = path.join(ROOT, "dist", "markdown", "ALL_RULES.md")
const CLAUDE_MAX_CHARS = 15_000
const ALL_RULES_MAX_CHARS_WARN = 2_000_000
const RULE_MAX_CHARS_WARN = 30_000

// When RULES_INDEX_ONLY=0, legacy full-content could be used; currently index-only is the only path.
const RULES_INDEX_ONLY = process.env.RULES_INDEX_ONLY !== "0"

const main = async () => {
  if (!RULES_INDEX_ONLY) {
    console.warn(
      "[rules] RULES_INDEX_ONLY=0: index-only is still used (legacy path not implemented).",
    )
  }
  const checkOnly = process.argv.includes("--check")

  let sourceFiles = []
  try {
    sourceFiles = await listFilesRecursive(SOURCE_DIR)
  } catch {
    console.error("Missing rules source directory: /rules")
    process.exit(1)
  }

  const bundle = await generateBundle(sourceFiles, SOURCE_DIR)

  for (const item of bundle) {
    const bodyLen = String(item.content ?? "").length
    if (bodyLen > RULE_MAX_CHARS_WARN) {
      console.warn(
        `[rules] Large rule body: ${item.rel} (${bodyLen} chars) > ${RULE_MAX_CHARS_WARN}. Consider splitting.`,
      )
    }
  }

  const nextClaude = renderClaudeIndexOnly(bundle, {
    maxChars: CLAUDE_MAX_CHARS,
    includeShortSummary: false,
  })
  // AGENTS, GEMINI, WINDSURF are index-only (RULES_INDEX_ONLY=0 would switch to legacy full-content if that path existed)
  const nextAgents = renderAgents(bundle)
  const nextGemini = renderAntigravity(bundle)
  const nextWindsurf = renderWindsurf(bundle)
  const nextAllRules = renderAllRules(bundle)

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

    const currentAllRules = await readIfExists(ALL_RULES_PATH)
    if (currentAllRules !== nextAllRules) {
      errors.push("Outdated generated file: ALL_RULES.md")
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
  await fs.writeFile(ALL_RULES_PATH, nextAllRules, "utf8")

  if (nextAllRules.length > ALL_RULES_MAX_CHARS_WARN) {
    console.warn(
      `[rules] ALL_RULES.md is large (${nextAllRules.length} chars > ${ALL_RULES_MAX_CHARS_WARN}). Consider splitting or excluding heavy rules.`,
    )
  }

  console.log(`Wrote CLAUDE.md bootstrap (${nextClaude.length} chars) -> ${CLAUDE_PATH}`)
  console.log(`Wrote dist/markdown/ALL_RULES.md (${nextAllRules.length} chars)`)
  console.log("Compiled rules for Cursor, Claude, Codex, Antigravity (Gemini), and Windsurf.")
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
