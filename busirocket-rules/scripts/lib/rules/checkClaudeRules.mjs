import { promises as fs } from "node:fs"
import { listFilesRecursive } from "../fs/listFilesRecursive.mjs"
import { sha256 } from "../hash/sha256.mjs"
import { normalizeRel } from "./normalizeRel.mjs"
import { toClaudeRule } from "./toClaudeRule.mjs"

/**
 * Compare source .mdc with .claude/rules output (expected = toClaudeRule per file, hashed).
 *
 * @param {string[]} sourceFiles - Full paths to source files
 * @param {string} sourceDir - Base directory for source
 * @param {string} claudeRulesDir - .claude/rules directory
 * @returns {Promise<string[]>} - List of error messages
 */
export const checkClaudeRules = async (sourceFiles, sourceDir, claudeRulesDir) => {
  const expectedMap = new Map()
  const mdcFiles = sourceFiles
    .filter((sourcePath) => sourcePath.endsWith(".mdc"))
    .sort((a, b) => a.localeCompare(b))

  for (const sourcePath of mdcFiles) {
    const rel = normalizeRel(sourceDir, sourcePath).replace(/\.mdc$/, ".md")
    const sourceContent = await fs.readFile(sourcePath, "utf8")
    expectedMap.set(rel, sha256(Buffer.from(`${toClaudeRule(sourceContent)}\n`)))
  }

  let actualFiles
  try {
    actualFiles = await listFilesRecursive(claudeRulesDir)
  } catch {
    return ["Missing generated directory: .claude/rules"]
  }

  const actualMap = new Map()
  for (const actualPath of actualFiles) {
    const rel = normalizeRel(claudeRulesDir, actualPath)
    const content = await fs.readFile(actualPath)
    actualMap.set(rel, sha256(content))
  }

  const errors = []

  for (const [filePath, hash] of expectedMap.entries()) {
    if (!actualMap.has(filePath)) {
      errors.push(`Missing generated file: .claude/rules/${filePath}`)
      continue
    }

    if (actualMap.get(filePath) !== hash) {
      errors.push(`Outdated generated file: .claude/rules/${filePath}`)
    }
  }

  for (const filePath of actualMap.keys()) {
    if (!expectedMap.has(filePath)) {
      errors.push(`Unexpected generated file: .claude/rules/${filePath}`)
    }
  }

  return errors
}
