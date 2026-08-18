import { renderClaudeValueMap } from "./renderClaudeValueMap"
import { resolveValueMap } from "./resolveValueMap"
import type { McpTarget } from "../../domains/mcp/types/McpTarget"
import type { McpValue } from "../../domains/mcp/types/McpValue"

export const renderValueMapForTarget = (
  source: Record<string, McpValue>,
  target: McpTarget,
  env: NodeJS.ProcessEnv,
) => (target === "gemini" ? resolveValueMap(source, env) : renderClaudeValueMap(source, env))
