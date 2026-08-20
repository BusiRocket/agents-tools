import { rename, rm } from "node:fs/promises"

export const reclaimGuidanceLock = async (
  lockPath: string,
  stalePath: string,
): Promise<boolean> => {
  try {
    await rename(lockPath, stalePath)
    await rm(stalePath, { force: true })
    return true
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return false
    throw new Error("could not recover stale guidance lock", { cause: error })
  }
}
