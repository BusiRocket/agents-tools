import { isFannedOut } from "./isFannedOut"
import type { CurationManifest } from "./types/CurationManifest"

export const selectFannedOutSkills = (manifest: CurationManifest, target: string) =>
  Object.entries(manifest.entries)
    .filter(([, entry]) => isFannedOut(entry, target))
    .map(([name]) => name)
