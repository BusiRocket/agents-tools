import { groupByCategoryAndSubcategory } from "./groupByCategoryAndSubcategory"
import { normalizeLineEndings } from "./normalizeLineEndings"
import { normalizeRel } from "./normalizeRel"
import { renderGrouped } from "./renderGrouped"

/**
 * ALL_RULES.md renderer.
 * Emits every rule with full content, grouped by category and subcategory.
 *
 * @param {Array<{ rel: string, frontmatter?: any, content?: string }>} bundle
 * @returns {string}
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function renderAllRules(bundle: any[]) {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  const items = (bundle ?? [])
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .map((item: any) => ({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      rel: normalizeRel(item.rel),
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      content: normalizeLineEndings(String(item.content ?? "")),
    }))
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    .filter((i: any) => i.rel?.endsWith(".mdc"))
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    .sort((a: any, b: any) => a.rel.localeCompare(b.rel))
  const grouped = groupByCategoryAndSubcategory(items)
  const header = [
    "# ALL_RULES.md",
    "",
    "This file contains the full text of every rule, grouped by category and subcategory.",
    "",
  ].join("\n")
  const body = renderGrouped(grouped)
  return `${header}${body}`
}
