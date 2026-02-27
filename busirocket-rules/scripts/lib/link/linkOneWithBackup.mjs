import { promises as fs } from "node:fs"
import path from "node:path"
import { backupExistingPath } from "./backupExistingPath.mjs"
import { ensureParentDirectory } from "./ensureParentDirectory.mjs"

/**
 * Create a symlink from source to target, backing up existing target if needed.
 *
 * @param {{ source: string, target: string }} link - Source and target paths
 * @returns {Promise<{ target: string, source: string, status: string, backupPath?: string | null }>}
 */
export const linkOneWithBackup = async ({ source, target }) => {
  await ensureParentDirectory(target)
  await fs.access(source)

  const info = await backupExistingPath(target)

  if (info.exists && info.symlink) {
    const resolvedCurrent = path.resolve(path.dirname(target), info.current)
    if (resolvedCurrent === source) {
      return { target, source, status: "unchanged" }
    }

    await fs.unlink(target)
  }

  await fs.symlink(source, target)

  return {
    target,
    source,
    status: "linked",
    backupPath: info.backupPath ?? null,
  }
}
