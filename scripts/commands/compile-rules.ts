/* eslint-disable sonarjs/cognitive-complexity */
import { promises as fs } from "node:fs"
import path from "node:path"
import { listFilesRecursive } from "../lib/fs/utils/listFilesRecursive"
import { readIfExists } from "../lib/fs/utils/readIfExists"
import { checkAntigravityRules } from "../lib/rules/utils/checkAntigravityRules"
import { checkClaudeRules } from "../lib/rules/utils/checkClaudeRules"
import { checkCursorRules } from "../lib/rules/utils/checkCursorRules"
import { checkWindsurfRules } from "../lib/rules/utils/checkWindsurfRules"
import { generateBundle } from "../lib/rules/utils/generateBundle"
import { renderAgents } from "../lib/rules/utils/renderAgents"
import { renderAntigravity } from "../lib/rules/utils/renderAntigravity"
import { renderAllRules } from "../lib/rules/utils/renderAllRules"
import { renderClaudeIndexOnly } from "../lib/rules/utils/renderClaudeIndexOnly"
import { renderCodexDefaultRules } from "../lib/rules/utils/renderCodexDefaultRules"
import { renderWindsurf } from "../lib/rules/utils/renderWindsurf"
import { syncAntigravityRules } from "../lib/rules/utils/syncAntigravityRules"
import { syncClaudeRules } from "../lib/rules/utils/syncClaudeRules"
import { syncCursorRules } from "../lib/rules/utils/syncCursorRules"
import { syncWindsurfRules } from "../lib/rules/utils/syncWindsurfRules"

const ROOT = process.cwd()
const SOURCE_DIR = path.join(ROOT, "src", "rules")
const CURSOR_DIR = path.join(ROOT, "dist", "global", ".cursor", "rules")
const CLAUDE_RULES_DIR = path.join(ROOT, "dist", "global", ".claude", "rules")
const ANTIGRAVITY_DIR = path.join(ROOT, "dist", "global", ".agent", "rules")
const WINDSURF_DIR = path.join(ROOT, "dist", "global", ".windsurf", "rules")
const CODEX_RULES_DIR = path.join(ROOT, "dist", "global", "codex", "rules")
const CODEX_DEFAULT_RULES_PATH = path.join(CODEX_RULES_DIR, "default.rules")
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

  let sourceFiles: string[] = []
  try {
    sourceFiles = await listFilesRecursive(SOURCE_DIR)
  } catch {
    console.error("Missing rules source directory: /rules")
    process.exit(1)
  }

  const bundle = await generateBundle(sourceFiles, SOURCE_DIR)

  for (const item of bundle) {
    const bodyLen = item.content.length
    if (bodyLen > RULE_MAX_CHARS_WARN) {
      console.warn(
        `[rules] Large rule body: ${item.rel} (${String(bodyLen)} chars) > ${String(RULE_MAX_CHARS_WARN)}. Consider splitting.`,
      )
    }
  }

  const nextClaude = renderClaudeIndexOnly(bundle, {
    maxChars: CLAUDE_MAX_CHARS,
    includeShortSummary: false,
  })

  const nextAgents = renderAgents(bundle)
  const nextGemini = renderAntigravity(bundle)
  const nextWindsurf = renderWindsurf(bundle)
  const nextAllRules = renderAllRules(bundle)
  const nextCodexDefaultRules = renderCodexDefaultRules()

  if (checkOnly) {
    const errors: string[] = [
      ...(await checkCursorRules(sourceFiles, SOURCE_DIR, CURSOR_DIR)),
      ...(await checkClaudeRules(sourceFiles, SOURCE_DIR, CLAUDE_RULES_DIR)),
      ...(await checkAntigravityRules(sourceFiles, SOURCE_DIR, ANTIGRAVITY_DIR)),
      ...(await checkWindsurfRules(sourceFiles, SOURCE_DIR, WINDSURF_DIR)),
    ]

    const currentClaude = await readIfExists(CLAUDE_PATH)
    const currentAgents = await readIfExists(AGENTS_PATH)
    const currentGemini = await readIfExists(GEMINI_PATH)
    const currentWindsurf = await readIfExists(WINDSURF_PATH)

    if (currentClaude !== nextClaude) errors.push("Outdated generated file: CLAUDE.md")
    if (currentAgents !== nextAgents) errors.push("Outdated generated file: AGENTS.md")
    if (currentGemini !== nextGemini) errors.push("Outdated generated file: GEMINI.md")
    if (currentWindsurf !== nextWindsurf) errors.push("Outdated generated file: WINDSURF.md")

    const currentAllRules = await readIfExists(ALL_RULES_PATH)
    if (currentAllRules !== nextAllRules) errors.push("Outdated generated file: ALL_RULES.md")

    const currentCodexDefaultRules = await readIfExists(CODEX_DEFAULT_RULES_PATH)
    if (currentCodexDefaultRules !== nextCodexDefaultRules)
      errors.push("Outdated generated file: codex/rules/default.rules")

    if (errors.length > 0) {
      console.error("Rules are not compiled or are out of date:\\n")
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

  await fs.mkdir(CODEX_RULES_DIR, { recursive: true })
  await fs.writeFile(CODEX_DEFAULT_RULES_PATH, nextCodexDefaultRules, "utf8")
  await fs.mkdir(path.dirname(CLAUDE_PATH), { recursive: true })
  await fs.writeFile(CLAUDE_PATH, nextClaude, "utf8")
  await fs.writeFile(AGENTS_PATH, nextAgents, "utf8")
  await fs.writeFile(GEMINI_PATH, nextGemini, "utf8")
  await fs.writeFile(WINDSURF_PATH, nextWindsurf, "utf8")
  await fs.writeFile(ALL_RULES_PATH, nextAllRules, "utf8")

  if (nextAllRules.length > ALL_RULES_MAX_CHARS_WARN) {
    console.warn(
      `[rules] ALL_RULES.md is large (${String(nextAllRules.length)} chars > ${String(ALL_RULES_MAX_CHARS_WARN)}). Consider splitting or excluding heavy rules.`,
    )
  }

  console.log(`Wrote CLAUDE.md bootstrap (${String(nextClaude.length)} chars) -> ${CLAUDE_PATH}`)
  console.log(`Wrote dist/markdown/ALL_RULES.md (${String(nextAllRules.length)} chars)`)
  console.log("Compiled rules for Cursor, Claude, Codex, Antigravity (Gemini), and Windsurf.")
}

if (import.meta.url === `file://${String(process.argv[1])}`) {
  main().catch(console.error)
}
