/**
 * Verify generated index-only outputs against Definition of Done.
 * Optional: assert CLAUDE.md matches freshly generated output (golden master).
 */
import path from "node:path"
import { listFilesRecursive } from "./lib/fs/listFilesRecursive.mjs"
import { readIfExists } from "./lib/fs/readIfExists.mjs"
import { generateBundle } from "./lib/rules/generateBundle.mjs"
import { renderClaudeIndexOnly } from "./lib/rules/renderClaudeIndexOnly.mjs"

const ROOT = process.cwd()
const SOURCE_DIR = path.join(ROOT, "src", "rules")
const CLAUDE_PATH = path.join(ROOT, "dist", "markdown", "CLAUDE.md")
const AGENTS_PATH = path.join(ROOT, "dist", "markdown", "AGENTS.md")
const GEMINI_PATH = path.join(ROOT, "dist", "markdown", "GEMINI.md")
const WINDSURF_PATH = path.join(ROOT, "dist", "markdown", "WINDSURF.md")

const DEFAULT_MIN_REFS = 50
const DEFAULT_MAX_CHARS = 50_000

/**
 * DoD checks on index-only output string.
 * @param {string} output
 * @param {{ maxChars?: number, minRefs?: number }} options
 * @returns {{ ok: boolean, errors: string[] }}
 */
export function verifyIndexOnlyOutput(output, options = {}) {
  const maxChars = options.maxChars ?? DEFAULT_MAX_CHARS
  const minRefs = options.minRefs ?? DEFAULT_MIN_REFS
  const errors = []

  if (typeof output !== "string") {
    return { ok: false, errors: ["Output is not a string"] }
  }

  if (output.includes("```mdc")) {
    errors.push('Output must not contain inline mdc blocks (no "```mdc")')
  }

  if (!output.includes("## Rules index (router)")) {
    errors.push('Output must include "## Rules index (router)"')
  }

  const refMatches = output.match(/@rules\/[^\s`]+/g)
  const refs = refMatches ? [...new Set(refMatches)] : []
  if (refs.length < minRefs) {
    errors.push(`Expected at least ${minRefs} @rules/ references, got ${refs.length}`)
  }

  const duplicates = refMatches && refMatches.length !== refs.length
  if (duplicates) {
    errors.push("Duplicate @rules/ references found")
  }

  if (output.length > maxChars) {
    errors.push(`Output length ${output.length} exceeds maxChars ${maxChars}`)
  }

  return { ok: errors.length === 0, errors }
}

/**
 * Assert CLAUDE.md on disk is byte-identical to freshly generated output (golden master).
 * @returns {Promise<{ ok: boolean, error?: string }>}
 */
export async function verifyClaudeGoldenMaster() {
  try {
    const sourceFiles = await listFilesRecursive(SOURCE_DIR)
    const bundle = await generateBundle(sourceFiles, SOURCE_DIR)
    const generated = renderClaudeIndexOnly(bundle, {
      maxChars: 15_000,
      includeShortSummary: false,
    })
    const onDisk = await readIfExists(CLAUDE_PATH)
    if (onDisk === null) {
      return { ok: false, error: "CLAUDE.md not found (run pnpm rules:compile first)" }
    }
    if (onDisk !== generated) {
      return {
        ok: false,
        error: "CLAUDE.md is not byte-identical to generated output (golden master mismatch)",
      }
    }
    return { ok: true }
  } catch (err) {
    return { ok: false, error: String(err.message ?? err) }
  }
}

async function main() {
  const goldenOnly = process.argv.includes("--golden-only")
  const skipGolden = process.argv.includes("--skip-golden")

  if (!skipGolden) {
    const golden = await verifyClaudeGoldenMaster()
    if (!golden.ok) {
      console.error("[verify] Golden master check failed:", golden.error)
      process.exit(1)
    }
    console.log("[verify] CLAUDE.md golden master OK")
    if (goldenOnly) return
  }

  for (const [name, filePath, maxChars] of [
    ["CLAUDE.md", CLAUDE_PATH, 15_000],
    ["AGENTS.md", AGENTS_PATH, 50_000],
    ["GEMINI.md", GEMINI_PATH, 50_000],
    ["WINDSURF.md", WINDSURF_PATH, 50_000],
  ]) {
    const content = await readIfExists(filePath)
    if (content && content.includes("## Rules index (router)")) {
      const result = verifyIndexOnlyOutput(content, { maxChars, minRefs: 40 })
      if (!result.ok) {
        console.error(`[verify] DoD check failed for ${name}:`)
        result.errors.forEach((e) => console.error("  -", e))
        process.exit(1)
      }
      console.log(`[verify] ${name} DoD OK`)
    }
  }

  console.log("[verify] All checks passed.")
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
