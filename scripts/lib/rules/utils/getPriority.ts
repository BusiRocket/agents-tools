/**
 * @param {{ frontmatter: object }} item
 * @returns {string}
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getPriority(item: any) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { frontmatter } = item
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  if (frontmatter.alwaysApply === true) return "high"
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
  if (frontmatter.globs && frontmatter.globs.trim() !== "") return "high"
  return "medium"
}
