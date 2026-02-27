/**
 * Convert relative rule references to Antigravity @mentions
 * @param {string} content - Rule content
 * @param {string} _currentPath - Current rule file path
 * @returns {string} - Content with converted references
 */
export function convertToAntigravityMentions(content, _currentPath) {
  // Convert .cursor/rules/ references to .agent/rules/
  let converted = content.replace(/\.cursor\/rules\//g, ".agent/rules/")

  // Ensure @ mentions are preserved
  // Antigravity supports @filename for relative paths
  return converted
}
