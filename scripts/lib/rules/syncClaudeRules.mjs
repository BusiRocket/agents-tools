import { promises as fs } from "node:fs"
import path from "node:path"
import { ensureDir } from "../fs/ensureDir.mjs"
import { normalizeRel } from "./normalizeRel.mjs"
import { toClaudeRule } from "./toClaudeRule.mjs"

/**
 * Sync .claude/rules: clear target, then write each .mdc as .md using toClaudeRule.
 *
 * @param {string[]} sourceFiles - Full paths to source files
 * @param {string} sourceDir - Base directory for source
 * @param {string} claudeRulesDir - .claude/rules directory
 * @returns {Promise<void>}
 */
export const syncClaudeRules = async (sourceFiles, sourceDir, claudeRulesDir) => {
  await fs.rm(claudeRulesDir, { recursive: true, force: true })
  await ensureDir(claudeRulesDir)

  const mdcFiles = sourceFiles
    .filter((sourcePath) => sourcePath.endsWith(".mdc"))
    .sort((a, b) => a.localeCompare(b))

  for (const sourcePath of mdcFiles) {
    const relativePath = normalizeRel(sourceDir, sourcePath).replace(/\.mdc$/, ".md")
    const targetPath = path.join(claudeRulesDir, relativePath)
    const sourceContent = await fs.readFile(sourcePath, "utf8")
    const claudeContent = `${toClaudeRule(sourceContent)}\n`

    await ensureDir(path.dirname(targetPath))
    await fs.writeFile(targetPath, claudeContent, "utf8")
  }
}
