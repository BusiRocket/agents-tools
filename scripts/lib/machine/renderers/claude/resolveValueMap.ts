import { isSecretReference } from "../../secrets/isSecretReference"
import { resolveReference } from "../../secrets/resolveReference"
import type { McpValue } from "../../domains/mcp/McpManifest"

export type ResolvedMap = { values: Record<string, string>; missing: string[] }

export const resolveValueMap = (
  source: Record<string, McpValue>,
  env: NodeJS.ProcessEnv,
): ResolvedMap => {
  const values: Record<string, string> = {}
  const missing: string[] = []

  for (const [key, value] of Object.entries(source)) {
    if (!isSecretReference(value)) {
      values[key] = value
      continue
    }

    const resolved = resolveReference(value, env)
    if (resolved.resolved) {
      values[key] = resolved.value
    } else {
      missing.push(resolved.name)
    }
  }

  return { values, missing }
}
