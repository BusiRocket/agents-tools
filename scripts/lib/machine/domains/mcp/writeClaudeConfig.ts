import { promises as fs } from "node:fs"

type WriteInput = {
  path: string
  servers: Record<string, unknown>
  ownedNames: string[]
}

const readExisting = async (path: string): Promise<Record<string, unknown>> => {
  try {
    const contents = await fs.readFile(path, "utf8")
    if (contents.trim() === "") {
      return {}
    }
    return JSON.parse(contents) as Record<string, unknown>
  } catch {
    return {}
  }
}

export const writeClaudeConfig = async ({ path, servers, ownedNames }: WriteInput) => {
  const existing = await readExisting(path)
  const currentServers = (existing["mcpServers"] ?? {}) as Record<string, unknown>
  const merged: Record<string, unknown> = {}

  for (const [name, value] of Object.entries(currentServers)) {
    if (!ownedNames.includes(name) && !(name in servers)) {
      merged[name] = value
    }
  }

  for (const name of Object.keys(servers).sort()) {
    merged[name] = servers[name]
  }

  const sorted: Record<string, unknown> = {}
  for (const name of Object.keys(merged).sort()) {
    sorted[name] = merged[name]
  }

  await fs.writeFile(path, `${JSON.stringify({ ...existing, mcpServers: sorted }, null, 2)}\n`)

  return Object.keys(servers)
}
