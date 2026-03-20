// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const renderQualityMarkdown = (entries: any[]) => {
  const lines = ["# Skills Quality Report", ""]

  for (const entry of entries) {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions, @typescript-eslint/no-unsafe-member-access
    lines.push(`## ${entry.name}`)
    lines.push("")
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions, @typescript-eslint/no-unsafe-member-access
    lines.push(`- path: ${entry.relativePath}`)
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/prefer-nullish-coalescing
    lines.push(`- skillClass: ${entry.skillClass || "unknown"}`)
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions, @typescript-eslint/no-unsafe-member-access
    lines.push(`- score: ${entry.score}`)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (entry.warnings.length === 0) {
      lines.push("- warnings: none")
    } else {
      lines.push("- warnings:")
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      for (const warning of entry.warnings) {
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        lines.push(`  - ${warning}`)
      }
    }
    lines.push("")
  }

  return `${lines.join("\n")}\n`
}
