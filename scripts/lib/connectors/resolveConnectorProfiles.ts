export const resolveConnectorProfiles = (
  requested: string | undefined,
): ("claude-personal" | "claude-favish")[] => {
  if (requested === "personal" || requested === "claude-personal") return ["claude-personal"]
  if (requested === "favish" || requested === "claude-favish") return ["claude-favish"]
  return ["claude-personal", "claude-favish"]
}
