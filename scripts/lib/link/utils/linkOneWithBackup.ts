import { promises as fs } from "node:fs"
import { ensureParentDirectory } from "./ensureParentDirectory"

export const linkOneWithBackup = async ({ source, target }: { source: string; target: string }) => {
  await ensureParentDirectory(target)
  await fs.access(source)

  await fs.rm(target, { recursive: true, force: true })

  await fs.symlink(source, target)

  return {
    target,
    source,
    status: "linked",
    backupPath: null,
  }
}
