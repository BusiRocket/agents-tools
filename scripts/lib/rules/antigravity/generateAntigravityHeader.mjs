/**
 * Generate Antigravity rule metadata header
 * @param {object} frontmatter - Parsed frontmatter
 * @param {string} activation - Activation mode
 * @returns {string} - Formatted metadata
 */
export function generateAntigravityHeader(frontmatter, activation) {
  const { description } = frontmatter

  return `<!-- Antigravity Rule
Activation: ${activation}
Description: ${description || "No description"}
-->\n\n`
}
