import { promises as fs } from "node:fs"
import { readCodexSkillReads } from "./readCodexSkillReads"

export const readCodexSkillReadsFromFile = async (path: string) => {
  try {
    return readCodexSkillReads(await fs.readFile(path, "utf8"))
  } catch {
    return {}
  }
}
