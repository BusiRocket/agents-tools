import path from "node:path"
import { processSourceFile } from "./helpers/processSourceFile.mjs"
import { writeRuleFile } from "./helpers/writeRuleFile.mjs"
import { toAntigravityRule } from "./toAntigravityRule.mjs"
import { ensureDir } from "../fs/ensureDir.mjs"

/**
 * Sync rules to Antigravity format (.agent/rules/)
 * @param {string[]} sourceFiles - Array of source .mdc files
 * @param {string} sourceDir - Source directory path
 * @param {string} targetDir - Target .agent/rules directory
 */
export async function syncAntigravityRules(sourceFiles, sourceDir, targetDir) {
  await ensureDir(targetDir)
  const workflowsDir = path.join(path.dirname(targetDir), "workflows")
  await ensureDir(workflowsDir)

  for (const file of sourceFiles) {
    const { parsed, relativePath } = await processSourceFile(file, sourceDir)
    const converted = toAntigravityRule(parsed, relativePath)

    for (const part of converted) {
      const targetPath = part.isWorkflow
        ? path.join(workflowsDir, `${part.name}.md`)
        : path.join(targetDir, `${part.name}.md`)
      await writeRuleFile(targetPath, part.content)
    }
  }
}
