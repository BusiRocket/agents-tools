import { renderClaudeValueMap } from "./renderClaudeValueMap"
import type { McpValue } from "../../domains/mcp/types/McpValue"

export const renderValueMapForTarget = (source: Record<string, McpValue>, env: NodeJS.ProcessEnv) =>
  renderClaudeValueMap(source, env)
