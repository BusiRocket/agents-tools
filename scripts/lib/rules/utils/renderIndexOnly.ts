import { defaultGetRuleRef } from "./defaultGetRuleRef"
import { getOneLineDescription } from "./getOneLineDescription"
import { groupByTopSegment } from "./groupByTopSegment"
import { normalizeRel } from "./normalizeRel"
import { renderRouter } from "./renderRouter"

/**
 * Generic index-only renderer engine. Emits only rule references (path + short description).
 * No rule bodies. No IDE-specific logic; wrappers (skins) pass options/callbacks.
 *
 * @param {Array<{ rel: string, frontmatter: object, content: string }>} bundle
 * @param {RenderIndexOnlyOptions} options
 * @returns {string}
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function renderIndexOnly(bundle: any[], options: any = {}) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
  const maxChars = typeof options.maxChars === "number" ? options.maxChars : 15_000
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const onLimit = options.onLimit === "truncate" ? "truncate" : "error"
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const includeShortSummary = options.includeShortSummary === true
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
  const referencePrefix = options.referencePrefix ?? "@rules/"
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
  const title = options.title ?? "# Index"
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
  const headerIntro = options.headerIntro ?? ""
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
  const embedContent = options.embedContent ?? ""
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const getRuleRef =
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    typeof options.getRuleRef === "function"
      ? // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        options.getRuleRef
      : // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        defaultGetRuleRef(referencePrefix)
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const getRuleBadges =
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    typeof options.getRuleBadges === "function" ? options.getRuleBadges : () => []
  const attempt = (withShortSummary: boolean) => {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    const items = (bundle ?? [])
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((item: any) => ({
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
        rel: normalizeRel(item.rel),
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        frontmatter: item.frontmatter ?? {},
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        content: item.content ?? "",
      }))
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      .filter((i: any) => i.rel?.endsWith(".mdc"))
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      .sort((a: any, b: any) => a.rel.localeCompare(b.rel))

    const groups = groupByTopSegment(items)
    const header = [title, "", headerIntro].join("\n").trimEnd()
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const embedded = embedContent ? `\n\n---\n\n${embedContent.trim()}\n\n---` : ""
    const router = renderRouter(groups, {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      getRuleRef,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      getRuleBadges,
      getOneLineDesc: (item: {
        rel: string
        content?: string
        frontmatter?: Record<string, unknown>
        [key: string]: unknown
      }) => getOneLineDescription(item, { includeShortSummary: withShortSummary }),
    })
    return `${header}${embedded}\n\n${router}\n`
  }
  const primary = attempt(includeShortSummary)
  if (primary.length <= maxChars) return primary
  if (includeShortSummary) {
    const downgraded = attempt(false)
    if (downgraded.length <= maxChars) return downgraded
  }

  if (onLimit === "truncate") {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return primary.slice(0, maxChars)
  }

  throw new Error(
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    `Index exceeded size budget: ${primary.length} > ${maxChars} chars. ` +
      "Reduce descriptions/summaries or increase maxChars.",
  )
}
