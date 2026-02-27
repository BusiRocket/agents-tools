/**
 * Get Antigravity activation mode from frontmatter
 * @param {object} frontmatter - Parsed MDC frontmatter
 * @returns {string} - Antigravity activation mode
 */
export function getAntigravityActivation(frontmatter) {
  const { alwaysApply, globs } = frontmatter

  if (alwaysApply === true) {
    return "Always On"
  }

  if (globs && globs.trim() !== "") {
    return `Glob: ${globs}`
  }

  // Default to Model Decision for flexibility
  return "Model Decision"
}
