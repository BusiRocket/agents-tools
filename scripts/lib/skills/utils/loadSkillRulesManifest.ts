import { promises as fs } from "node:fs"

export const loadSkillRulesManifest = async (filePath: string) => {
  const raw = await fs.readFile(filePath, "utf8")
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return JSON.parse(raw)
}
