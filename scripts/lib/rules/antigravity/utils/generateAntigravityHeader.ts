/**
 * Generate Antigravity rule metadata header
 * @param {object} frontmatter - Parsed frontmatter
 * @param {string} activation - Activation mode
 * @returns {string} - Formatted metadata
 */
export function generateAntigravityHeader(
  frontmatter: Record<string, unknown>,
  activation: string,
) {
  const { description } = frontmatter
  const descStr = typeof description === "string" ? description : "No description"
  return `<!-- Antigravity Rule
Activation: ${activation}
Description: ${descStr}
-->\n\n`
}
