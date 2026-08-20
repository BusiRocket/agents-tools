export const isSupportedStdioMcpInitialization = (result: unknown): boolean => {
  if (typeof result !== "object" || result === null || Array.isArray(result)) return false
  const candidate = result as Record<string, unknown>
  if (candidate.protocolVersion !== "2025-11-25" && candidate.protocolVersion !== "2025-06-18") {
    return false
  }
  const capabilities = candidate.capabilities
  if (typeof capabilities !== "object" || capabilities === null || Array.isArray(capabilities)) {
    return false
  }
  const tools = (capabilities as Record<string, unknown>).tools
  return typeof tools === "object" && tools !== null && !Array.isArray(tools)
}
