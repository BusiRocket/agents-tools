export function extractShortSummaryLine(content?: string) {
  const text = content ?? ""
  // eslint-disable-next-line sonarjs/slow-regex
  const match = /##\s+Short summary\s*\n([\s\S]*?)(?=\n##\s|\n#\s|$)/i.exec(text)
  if (!match) return ""
  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
  const block = match[1] || ""
  const lines = block
    .split("\n")
    .map((l: string) => l.trim())
    .filter(Boolean)
  const bullet = lines.find((l: string) => l.startsWith("- ") || l.startsWith("* "))
  if (bullet) return bullet.replace(/^[-*]\s+/, "")
  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
  return lines[0] || ""
}
