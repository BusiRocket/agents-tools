import { promises as fs } from "node:fs"

const SECTION = /^\[mcp_servers\.([^\].]+)(?:\.[^\]]+)?\]$/
const KEY_VALUE = /^\s*([A-Za-z0-9_-]+)\s*=\s*(.+?)\s*$/

export const readCodexServers = async (configPath: string) => {
  let contents: string
  try {
    contents = await fs.readFile(configPath, "utf8")
  } catch {
    return {}
  }

  const servers: Record<string, Record<string, string>> = {}
  let current: string | undefined

  for (const line of contents.split("\n")) {
    const trimmed = line.trim()

    if (trimmed.startsWith("[")) {
      const match = SECTION.exec(trimmed)
      current = match?.[1]

      if (current && !servers[current]) {
        servers[current] = {}
      }
      continue
    }

    if (!current) {
      continue
    }

    const keyValue = KEY_VALUE.exec(trimmed)
    const target = servers[current]

    if (keyValue?.[1] && keyValue[2] !== undefined && target) {
      target[keyValue[1]] = keyValue[2]
    }
  }

  return servers
}
