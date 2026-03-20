/**
 * Get Antigravity activation mode from frontmatter
 * @param {object} frontmatter - Parsed MDC frontmatter
 * @returns {string} - Antigravity activation mode
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getAntigravityActivation(frontmatter: any) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { alwaysApply, globs } = frontmatter
  if (alwaysApply === true) {
    return "Always On"
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  if (globs && globs.trim() !== "") {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    return `Glob: ${globs}`
  }

  return "Model Decision"
}
