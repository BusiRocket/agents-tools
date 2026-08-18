import { renderClaudeServers } from "../../renderers/claude/renderClaudeServers"
import { renderCodexServers } from "../../renderers/codex/renderCodexServers"
import { renderGeminiServers } from "../../renderers/gemini/renderGeminiServers"
import { MCP_TARGETS } from "./constants/MCP_TARGETS"
import { writeClaudeConfig } from "./writeClaudeConfig"
import { writeCodexConfig } from "./writeCodexConfig"
import { writeGeminiSettings } from "./writeGeminiSettings"
import type { ApplyInput } from "./types/ApplyInput"
import type { McpTarget } from "./types/McpTarget"

export const apply = async ({ manifest, paths, owned, env }: ApplyInput) => {
  const nextOwned: Partial<Record<McpTarget, string[]>> = {}
  const missing: string[] = []

  for (const target of MCP_TARGETS) {
    if (target === "codex") {
      const rendered = renderCodexServers(manifest, env)
      missing.push(...rendered.missing)

      nextOwned[target] = await writeCodexConfig({
        path: paths.codex,
        toml: rendered.toml,
        ownedNames: owned.codex,
        renderedNames: rendered.names,
      })
      continue
    }

    if (target === "gemini") {
      const rendered = renderGeminiServers(manifest, env)
      missing.push(...rendered.missing)
      nextOwned[target] = await writeGeminiSettings({
        path: paths.gemini,
        servers: rendered.servers,
        ownedNames: owned.gemini,
      })
      continue
    }

    const rendered = renderClaudeServers(manifest, target, env)
    missing.push(...rendered.missing)

    nextOwned[target] = await writeClaudeConfig({
      path: paths[target],
      servers: rendered.servers,
      ownedNames: owned[target],
    })
  }

  return { owned: nextOwned as Record<McpTarget, string[]>, missing }
}
