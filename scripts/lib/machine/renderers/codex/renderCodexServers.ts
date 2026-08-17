import { resolveValueMap } from "../claude/resolveValueMap"
import { toStringArgs } from "../claude/toStringArgs"
import { escapeTomlString } from "./escapeTomlString"
import type { McpManifest } from "../../domains/mcp/types/McpManifest"

export const renderCodexServers = (manifest: McpManifest, env: NodeJS.ProcessEnv) => {
  const blocks: string[] = []
  const missing: string[] = []
  const names: string[] = []

  for (const [name, server] of Object.entries(manifest.servers)) {
    if (!server.targets.includes("codex")) {
      continue
    }

    const envMap = resolveValueMap(server.env ?? {}, env)
    if (envMap.missing.length > 0) {
      missing.push(...envMap.missing)
      continue
    }

    const lines = [`[mcp_servers.${name}]`]

    if (server.transport === "stdio") {
      lines.push(`command = ${escapeTomlString(server.command ?? "")}`)

      const args = toStringArgs(server.args, server.target_overrides?.codex?.args_append ?? [])
      if (args.length > 0) {
        lines.push(`args = [${args.map(escapeTomlString).join(", ")}]`)
      }
    } else {
      lines.push(`url = ${escapeTomlString(server.url ?? "")}`)
    }

    const envEntries = Object.entries(envMap.values).map(
      ([key, value]) => `${key} = ${escapeTomlString(value)}`,
    )

    if (envEntries.length > 0) {
      lines.push("", `[mcp_servers.${name}.env]`, ...envEntries)
    }

    blocks.push(lines.join("\n"))
    names.push(name)
  }

  return { toml: blocks.join("\n\n"), missing, names }
}
