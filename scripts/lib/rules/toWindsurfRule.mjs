/**
 * Convert MDC frontmatter to Windsurf rule format
 *
 * Windsurf Rules:
 * - Located in: .windsurf/rules/
 * - Global rules: ~/.windsurf/rules/
 * - Similar to Cursor but with Cascade extensions
 * - Supports context-aware rule application
 */

import { formatWindsurfFrontmatter } from "./windsurf/formatWindsurfFrontmatter.mjs"
import { convertToWindsurfReferences } from "./windsurf/convertToWindsurfReferences.mjs"
import { addWindsurfAnnotations } from "./windsurf/addWindsurfAnnotations.mjs"

/**
 * Main conversion function
 * @param {object} parsed - Parsed MDC with frontmatter and content
 * @param {string} _rulePath - Original rule path
 * @returns {string} - Windsurf-formatted rule
 */
export function toWindsurfRule(parsed, _rulePath) {
  const frontmatter = formatWindsurfFrontmatter(parsed.frontmatter)
  let content = convertToWindsurfReferences(parsed.content)
  content = addWindsurfAnnotations(content, parsed.frontmatter)

  return `${frontmatter}\n\n${content}`
}
