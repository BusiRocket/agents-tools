import { promises as fs } from "node:fs"
import path from "node:path"
import { pathExists } from "./pathExists"

export const cleanGlobalPrefix = async (targetDir: string, prefix: string) => {
  const exists = await pathExists(targetDir)
  if (!exists) {
    return []
  }

  const targetStat = await fs.lstat(targetDir)
  if (targetStat.isSymbolicLink()) {
    try {
      await fs.realpath(targetDir)
    } catch {
      await fs.unlink(targetDir)
      return []
    }
  }

  if (!targetStat.isDirectory()) {
    return []
  }

  let entries
  try {
    entries = await fs.readdir(targetDir)
  } catch (error: unknown) {
    const err = error as { code?: string }
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (err?.code === "ENOENT" || err?.code === "ENOTDIR") {
      return []
    }
    throw error
  }
  const removed = []

  for (const entry of entries) {
    if (!entry.startsWith(prefix)) {
      continue
    }

    const fullPath = path.join(targetDir, entry)
    const stat = await fs.lstat(fullPath)

    if (stat.isSymbolicLink()) {
      await fs.unlink(fullPath)
    } else if (stat.isDirectory()) {
      await fs.rm(fullPath, { recursive: true, force: true })
    } else {
      await fs.unlink(fullPath)
    }

    removed.push(entry)
  }

  return removed
}
