// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const renderMarkdown = (report: any) => {
  const lines = []
  lines.push("# Skills Compatibility Report")
  lines.push("")
  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions, @typescript-eslint/no-unsafe-member-access
  lines.push(`Generated at: ${report.generatedAt}`)
  lines.push("")
  lines.push("## Summary")
  lines.push("")
  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions, @typescript-eslint/no-unsafe-member-access
  lines.push(`- Total skills: ${report.summary.totalSkills}`)
  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions, @typescript-eslint/no-unsafe-member-access
  lines.push(`- auto-migrable: ${report.summary.classificationCounts["auto-migrable"]}`)
  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions, @typescript-eslint/no-unsafe-member-access
  lines.push(`- manual-migration: ${report.summary.classificationCounts["manual-migration"]}`)
  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions, @typescript-eslint/no-unsafe-member-access
  lines.push(`- blocked: ${report.summary.classificationCounts.blocked}`)
  lines.push("")
  lines.push("## Exceptions")
  lines.push("")
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  if (report.exceptions.length === 0) {
    lines.push("- None")
  } else {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    for (const item of report.exceptions) {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions, @typescript-eslint/no-unsafe-member-access
      lines.push(`- ${item.skill}: ${item.reason}`)
    }
  }
  lines.push("")
  lines.push("## Migration Order")
  lines.push("")
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  for (const item of report.migrationOrder) {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    lines.push(`- ${item}`)
  }
  lines.push("")
  lines.push("## Skills")
  lines.push("")
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  for (const skill of report.skills) {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions, @typescript-eslint/no-unsafe-member-access
    lines.push(`### ${skill.name}`)
    lines.push("")
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions, @typescript-eslint/no-unsafe-member-access
    lines.push(`- path: ${skill.relativePath}`)
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions, @typescript-eslint/no-unsafe-member-access
    lines.push(`- classification: ${skill.classification}`)
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/prefer-nullish-coalescing
    lines.push(`- frontmatterFields: ${skill.frontmatterFields.join(", ") || "none"}`)
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions, @typescript-eslint/no-unsafe-member-access
    lines.push(`- hasOpenAiYaml: ${skill.hasOpenAiYaml}`)
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions, @typescript-eslint/no-unsafe-member-access
    lines.push(`- hasLegacyInlineRules: ${skill.hasLegacyInlineRules}`)
    lines.push("")
  }

  return `${lines.join("\n")}\n`
}
