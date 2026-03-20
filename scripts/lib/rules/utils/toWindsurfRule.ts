import { addWindsurfAnnotations } from "../windsurf/utils/addWindsurfAnnotations"
import { convertToWindsurfReferences } from "../windsurf/utils/convertToWindsurfReferences"
import { formatWindsurfFrontmatter } from "../windsurf/utils/formatWindsurfFrontmatter"

/**
 * Main conversion function
 * @param {object} parsed - Parsed MDC with frontmatter and content
 * @param {string} _rulePath - Original rule path
 * @returns {string} - Windsurf-formatted rule
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function toWindsurfRule(parsed: any, _rulePath: string) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
  const frontmatter = formatWindsurfFrontmatter(parsed.frontmatter)
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
  let content = convertToWindsurfReferences(parsed.content)
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  content = addWindsurfAnnotations(content, parsed.frontmatter)
  return `${frontmatter}\n\n${content}`
}
