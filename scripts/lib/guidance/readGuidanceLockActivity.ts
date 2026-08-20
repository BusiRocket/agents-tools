import { readFile, stat } from "node:fs/promises"

export const readGuidanceLockActivity = async (
  lockPath: string,
  staleAfterMs: number,
): Promise<boolean | undefined> => {
  let existing: string
  let ageMs: number
  try {
    existing = await readFile(lockPath, "utf8")
    ageMs = Date.now() - (await stat(lockPath)).mtimeMs
  } catch {
    return undefined
  }
  try {
    const parsed = JSON.parse(existing) as unknown
    if (
      typeof parsed !== "object" ||
      parsed === null ||
      typeof (parsed as { pid?: unknown }).pid !== "number" ||
      !Number.isSafeInteger((parsed as { pid: number }).pid) ||
      (parsed as { pid: number }).pid <= 0
    )
      return ageMs <= staleAfterMs
    try {
      process.kill((parsed as { pid: number }).pid, 0)
      return true
    } catch (error) {
      return (error as NodeJS.ErrnoException).code === "EPERM"
    }
  } catch {
    return ageMs <= staleAfterMs
  }
}
