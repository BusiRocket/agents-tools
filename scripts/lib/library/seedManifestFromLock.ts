import { seedEntryFromLock } from "./seedEntryFromLock"
import type { CurationEntry } from "./types/CurationEntry"
import type { CurationManifest } from "./types/CurationManifest"
import type { LockEntry } from "./types/LockEntry"

export const seedManifestFromLock = (
  lock: Record<string, LockEntry>,
  ours: string[],
): CurationManifest => {
  const entries: Record<string, CurationEntry> = {}

  for (const [name, entry] of Object.entries(lock)) {
    entries[name] = seedEntryFromLock(name, entry, ours)
  }

  return { version: 1, entries }
}
