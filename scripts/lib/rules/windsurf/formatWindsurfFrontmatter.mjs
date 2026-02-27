/**
 * Convert to Windsurf rule frontmatter format
 * @param {object} frontmatter - Parsed MDC frontmatter
 * @returns {string} - Formatted frontmatter for Windsurf
 */
export function formatWindsurfFrontmatter(frontmatter) {
  const lines = ["---"]

  if (frontmatter.description) {
    lines.push(`description: "${frontmatter.description}"`)
  }

  if (frontmatter.globs) {
    lines.push(`globs: "${frontmatter.globs}"`)
  }

  if (frontmatter.alwaysApply !== undefined) {
    lines.push(`alwaysApply: ${frontmatter.alwaysApply}`)
  }

  // Windsurf-specific: context priority
  if (frontmatter.priority) {
    lines.push(`priority: ${frontmatter.priority}`)
  } else {
    // Default priority based on alwaysApply
    lines.push(`priority: ${frontmatter.alwaysApply ? "high" : "medium"}`)
  }

  lines.push("---")
  return lines.join("\n")
}
