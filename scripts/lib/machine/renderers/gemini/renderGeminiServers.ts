import { renderGeminiServer } from "./renderGeminiServer"
import type { McpManifest } from "../../domains/mcp/types/McpManifest"

export const renderGeminiServers = (manifest: McpManifest, env: NodeJS.ProcessEnv) => {
  const servers: Record<string, unknown> = {}
  const missing: string[] = []

  for (const [name, server] of Object.entries(manifest.servers)) {
    if (!server.targets.includes("gemini") || server.disabled === true) continue

    const result = renderGeminiServer(server, env)
    missing.push(...result.missing)
    if (result.rendered !== undefined) servers[name] = result.rendered
  }

  return { servers, missing }
}
