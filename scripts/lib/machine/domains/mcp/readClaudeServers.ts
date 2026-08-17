import { promises as fs } from "node:fs"

export const readClaudeServers = async (configPath: string): Promise<Record<string, unknown>> => {
  let contents: string
  try {
    contents = await fs.readFile(configPath, "utf8")
  } catch {
    return {}
  }

  if (contents.trim() === "") {
    return {}
  }

  try {
    const parsed = JSON.parse(contents) as Record<string, unknown>
    const servers = parsed["mcpServers"]

    if (typeof servers !== "object" || servers === null) {
      return {}
    }

    return servers as Record<string, unknown>
  } catch {
    return {}
  }
}
