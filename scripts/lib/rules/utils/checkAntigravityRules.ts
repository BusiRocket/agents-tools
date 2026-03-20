import path from "node:path"
import { compareRuleFile } from "../helpers/utils/compareRuleFile"
import { processSourceFile } from "../helpers/utils/processSourceFile"
import { toAntigravityRule } from "./toAntigravityRule"

/**
 * Check if Antigravity rules are in sync
 * @param {string[]} sourceFiles - Array of source .mdc files
 * @param {string} sourceDir - Source directory path
 * @param {string} targetDir - Target .agent/rules directory
 * @returns {Promise<string[]>} - Array of error messages
 */
export async function checkAntigravityRules(
  sourceFiles: string[],
  sourceDir: string,
  targetDir: string,
) {
  const errors = []
  const workflowsDir = path.join(path.dirname(targetDir), "workflows")
  for (const file of sourceFiles) {
    const { parsed, relativePath } = await processSourceFile(file, sourceDir)
    const converted = toAntigravityRule(parsed, relativePath)

    for (const part of converted) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const targetPath = part.isWorkflow
        ? // eslint-disable-next-line @typescript-eslint/restrict-template-expressions, @typescript-eslint/no-unsafe-member-access
          path.join(workflowsDir, `${part.name}.md`)
        : // eslint-disable-next-line @typescript-eslint/restrict-template-expressions, @typescript-eslint/no-unsafe-member-access
          path.join(targetDir, `${part.name}.md`)

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      const { missing, outdated } = await compareRuleFile(targetPath, part.content)
      if (missing) errors.push(`Missing Antigravity rule: ${targetPath}`)
      else if (outdated) errors.push(`Outdated Antigravity rule: ${targetPath}`)
    }
  }

  return errors
}
