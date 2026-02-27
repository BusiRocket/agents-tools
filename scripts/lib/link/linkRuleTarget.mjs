import { promises as fs } from "node:fs"
import path from "node:path"
import { cleanGlobalPrefix } from "./cleanGlobalPrefix.mjs"
import { ensureParentDirectory } from "./ensureParentDirectory.mjs"
import { linkOneWithBackup } from "./linkOneWithBackup.mjs"

/**
 * Process one IDE's rule links: run cleanup if configured, then symlink or copy each link.
 *
 * @param {Object} ruleTarget - IDE rule target config from ideRuleTargets
 * @param {Object} ruleTarget.ide - IDE entry from registry
 * @param {Object} [ruleTarget.cleanup] - Optional cleanup config { dir, prefix }
 * @param {{ source: string, target: string, method: "symlink"|"copy" }[]} ruleTarget.links
 * @returns {Promise<{ cleaned: string[], linked: number, copied: number }>}
 */
export const linkRuleTarget = async (ruleTarget) => {
  let cleaned = []

  if (ruleTarget.cleanup) {
    cleaned = await cleanGlobalPrefix(ruleTarget.cleanup.dir, ruleTarget.cleanup.prefix)
  }

  let linked = 0
  let copied = 0

  for (const link of ruleTarget.links) {
    await ensureParentDirectory(link.target)

    if (link.method === "copy") {
      const content = await fs.readFile(link.source, "utf8")
      await fs.mkdir(path.dirname(link.target), { recursive: true })
      await fs.writeFile(link.target, content, "utf8")
      copied++
    } else {
      await linkOneWithBackup({ source: link.source, target: link.target })
      linked++
    }
  }

  return { cleaned, linked, copied }
}
