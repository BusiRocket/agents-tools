/**
 * Add Windsurf-specific annotations
 * @param {string} content - Rule content
 * @param {object} frontmatter - Parsed frontmatter
 * @returns {string} - Content with Windsurf annotations
 */
export function addWindsurfAnnotations(content, frontmatter) {
  let annotated = content

  // Add context markers for Cascade
  if (frontmatter.globs) {
    const fileTypes = frontmatter.globs.split(",").map((g) => g.trim())
    annotated = `<!-- Windsurf Context: ${fileTypes.join(", ")} -->\n\n${annotated}`
  }

  return annotated
}
