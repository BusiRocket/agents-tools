/**
 * Convert relative rule references to Windsurf paths
 * @param {string} content - Rule content
 * @returns {string} - Content with converted references
 */
export function convertToWindsurfReferences(content) {
  // Convert .cursor/rules/ to .windsurf/rules/
  let converted = content.replace(/\.cursor\/rules\//g, ".windsurf/rules/")

  // Convert .claude/rules/ to .windsurf/rules/
  converted = converted.replace(/\.claude\/rules\//g, ".windsurf/rules/")

  return converted
}
