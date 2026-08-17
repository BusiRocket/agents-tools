import { promises as fs } from "node:fs"
import { dirname, join } from "node:path"
import type { SnapshotEntry } from "./SnapshotEntry"

export const restoreSnapshot = async ({ runDir }: { runDir: string }) => {
  const raw = await fs.readFile(join(runDir, "manifest.json"), "utf8")
  const entries = JSON.parse(raw) as SnapshotEntry[]
  const restored: string[] = []

  for (const entry of entries) {
    if (entry.existed) {
      const contents = await fs.readFile(join(runDir, "files", entry.encoded))
      await fs.mkdir(dirname(entry.path), { recursive: true })
      await fs.writeFile(entry.path, contents)
    } else {
      await fs.rm(entry.path, { force: true })
    }

    restored.push(entry.path)
  }

  return restored
}
