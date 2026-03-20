/**
 * Convert to Windsurf rule frontmatter format
 * @param {object} frontmatter - Parsed MDC frontmatter
 * @returns {string} - Formatted frontmatter for Windsurf
 */
export function formatWindsurfFrontmatter(frontmatter: Record<string, unknown>) {
  const lines = ["---"]
  if (frontmatter.description) {
    // eslint-disable-next-line @typescript-eslint/no-base-to-string, @typescript-eslint/restrict-template-expressions
    lines.push(`description: "${frontmatter.description}"`)
  }

  if (frontmatter.globs) {
    // eslint-disable-next-line @typescript-eslint/no-base-to-string, @typescript-eslint/restrict-template-expressions
    lines.push(`globs: "${frontmatter.globs}"`)
  }

  if (frontmatter.alwaysApply !== undefined) {
    // eslint-disable-next-line @typescript-eslint/no-base-to-string, @typescript-eslint/restrict-template-expressions
    lines.push(`alwaysApply: ${frontmatter.alwaysApply}`)
  }

  if (frontmatter.priority) {
    // eslint-disable-next-line @typescript-eslint/no-base-to-string, @typescript-eslint/restrict-template-expressions
    lines.push(`priority: ${frontmatter.priority}`)
  } else {
    // Default priority based on alwaysApply
    lines.push(`priority: ${frontmatter.alwaysApply ? "high" : "medium"}`)
  }

  lines.push("---")
  return lines.join("\n")
}
