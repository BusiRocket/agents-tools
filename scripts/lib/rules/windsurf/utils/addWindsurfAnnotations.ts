/**
 * Add Windsurf-specific annotations
 * @param {string} content - Rule content
 * @param {object} frontmatter - Parsed frontmatter
 * @returns {string} - Content with Windsurf annotations
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function addWindsurfAnnotations(content: string, frontmatter: any) {
  let annotated = content
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  if (frontmatter.globs) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const fileTypes = frontmatter.globs.split(",").map((g: string) => g.trim())
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    annotated = `<!-- Windsurf Context: ${fileTypes.join(", ")} -->\n\n${annotated}`
  }

  return annotated
}
