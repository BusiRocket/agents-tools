import { resolveValueMap } from "./resolveValueMap"
import { toStringArgs } from "./toStringArgs"
import type { McpManifest } from "../../domains/mcp/types/McpManifest"
import type { McpTarget } from "../../domains/mcp/types/McpTarget"

export const renderClaudeServers = (
  manifest: McpManifest,
  target: McpTarget,
  env: NodeJS.ProcessEnv,
) => {
  const servers: Record<string, unknown> = {}
  const missing: string[] = []

  for (const [name, server] of Object.entries(manifest.servers)) {
    if (!server.targets.includes(target)) {
      continue
    }

    const envMap = resolveValueMap(server.env ?? {}, env)
    const headerMap = resolveValueMap(server.headers ?? {}, env)
    const serverMissing = [...envMap.missing, ...headerMap.missing]

    if (serverMissing.length > 0) {
      missing.push(...serverMissing)
      continue
    }

    if (server.transport === "stdio") {
      const args = toStringArgs(server.args, server.target_overrides?.[target]?.args_append ?? [])

      servers[name] = {
        type: "stdio",
        command: server.command,
        ...(args.length > 0 ? { args } : {}),
        ...(Object.keys(envMap.values).length > 0 ? { env: envMap.values } : {}),
      }
      continue
    }

    servers[name] = {
      type: server.transport,
      url: server.url,
      ...(Object.keys(headerMap.values).length > 0 ? { headers: headerMap.values } : {}),
    }
  }

  return { servers, missing }
}
