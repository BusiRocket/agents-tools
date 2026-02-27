import path from "node:path"
import { processSourceFile } from "./helpers/processSourceFile.mjs"
import { compareRuleFile } from "./helpers/compareRuleFile.mjs"
import { toAntigravityRule } from "./toAntigravityRule.mjs"

/**
 * Check if Antigravity rules are in sync
 * @param {string[]} sourceFiles - Array of source .mdc files
 * @param {string} sourceDir - Source directory path
 * @param {string} targetDir - Target .agent/rules directory
 * @returns {Promise<string[]>} - Array of error messages
 */
export async function checkAntigravityRules(sourceFiles, sourceDir, targetDir) {
  const errors = []
  const workflowsDir = path.join(path.dirname(targetDir), "workflows")

  for (const file of sourceFiles) {
    const { parsed, relativePath } = await processSourceFile(file, sourceDir)
    const converted = toAntigravityRule(parsed, relativePath)

    for (const part of converted) {
      const targetPath = part.isWorkflow
        ? path.join(workflowsDir, `${part.name}.md`)
        : path.join(targetDir, `${part.name}.md`)

      const { missing, outdated } = await compareRuleFile(targetPath, part.content)
      if (missing) errors.push(`Missing Antigravity rule: ${targetPath}`)
      else if (outdated) errors.push(`Outdated Antigravity rule: ${targetPath}`)
    }
  }

  return errors
}
