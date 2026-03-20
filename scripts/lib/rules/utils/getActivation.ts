/**
 * @param {{ frontmatter: object }} item
 * @returns {string}
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getActivation(item: any) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { frontmatter } = item
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  if (frontmatter.alwaysApply === true) return "Always On"
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/restrict-template-expressions
  if (frontmatter.globs && frontmatter.globs.trim() !== "") return `Glob: ${frontmatter.globs}`
  return "Model Decision"
}
