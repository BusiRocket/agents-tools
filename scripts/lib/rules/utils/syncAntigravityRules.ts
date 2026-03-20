import path from "node:path"
import { ensureDir } from "../../fs/utils/ensureDir"
import { processSourceFile } from "../helpers/utils/processSourceFile"
import { writeRuleFile } from "../helpers/utils/writeRuleFile"
import { toAntigravityRule } from "./toAntigravityRule"

/**
 * Sync rules to Antigravity format (.agent/rules/)
 * @param {string[]} sourceFiles - Array of source .mdc files
 * @param {string} sourceDir - Source directory path
 * @param {string} targetDir - Target .agent/rules directory
 */
export async function syncAntigravityRules(
  sourceFiles: string[],
  sourceDir: string,
  targetDir: string,
) {
  await ensureDir(targetDir)
  const workflowsDir = path.join(path.dirname(targetDir), "workflows")
  await ensureDir(workflowsDir)
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
      await writeRuleFile(targetPath, part.content)
    }
  }
}
