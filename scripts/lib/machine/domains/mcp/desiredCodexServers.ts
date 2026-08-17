import { renderCodexServers } from "../../renderers/codex/renderCodexServers"
import { normalizeCodexServer } from "./normalizeCodexServer"
import type { McpManifest } from "./McpManifest"
import type { NormalizedCodexServer } from "./normalizeCodexServer"

const SECTION = /^\[mcp_servers\.([^\].]+)\]$/
const KEY_VALUE = /^\s*([A-Za-z0-9_-]+)\s*=\s*(.+?)\s*$/

export const desiredCodexServers = (manifest: McpManifest, env: NodeJS.ProcessEnv) => {
  const { toml } = renderCodexServers(manifest, env)
  const records: Record<string, Record<string, string>> = {}
  let current: string | undefined

  for (const line of toml.split("\n")) {
    const trimmed = line.trim()

    if (trimmed.startsWith("[")) {
      const match = SECTION.exec(trimmed)
      current = match?.[1]

      if (current && !records[current]) {
        records[current] = {}
      }
      continue
    }

    if (!current) {
      continue
    }

    const keyValue = KEY_VALUE.exec(trimmed)
    const target = records[current]

    if (keyValue?.[1] && keyValue[2] !== undefined && target) {
      target[keyValue[1]] = keyValue[2]
    }
  }

  const normalized: Record<string, NormalizedCodexServer> = {}
  for (const [name, record] of Object.entries(records)) {
    normalized[name] = normalizeCodexServer(record)
  }

  return normalized
}
