import { promises as fs } from "node:fs"
import { join } from "node:path"
import type { SnapshotEntry } from "./SnapshotEntry"

export const createSnapshot = async ({ runDir, files }: { runDir: string; files: string[] }) => {
  await fs.mkdir(join(runDir, "files"), { recursive: true })
  const entries: SnapshotEntry[] = []

  for (const [index, path] of files.entries()) {
    const encoded = `${String(index)}-${path.replaceAll("/", "_")}`

    try {
      const contents = await fs.readFile(path)
      await fs.writeFile(join(runDir, "files", encoded), contents)
      entries.push({ encoded, path, existed: true })
    } catch {
      entries.push({ encoded, path, existed: false })
    }
  }

  await fs.writeFile(join(runDir, "manifest.json"), `${JSON.stringify(entries, null, 2)}\n`)
}
