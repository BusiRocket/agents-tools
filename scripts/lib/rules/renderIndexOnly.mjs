/**
 * Generic index-only renderer engine. Emits only rule references (path + short description).
 * No rule bodies. No IDE-specific logic; wrappers (skins) pass options/callbacks.
 *
 * @param {Array<{ rel: string, frontmatter: object, content: string }>} bundle
 * @param {RenderIndexOnlyOptions} options
 * @returns {string}
 */
export function renderIndexOnly(bundle, options = {}) {
  const maxChars = typeof options.maxChars === "number" ? options.maxChars : 15_000
  const onLimit = options.onLimit === "truncate" ? "truncate" : "error"
  const includeShortSummary = options.includeShortSummary === true
  const referencePrefix = options.referencePrefix ?? "@rules/"
  const title = options.title ?? "# Index"
  const headerIntro = options.headerIntro ?? ""
  const getRuleRef =
    typeof options.getRuleRef === "function"
      ? options.getRuleRef
      : defaultGetRuleRef(referencePrefix)
  const getRuleBadges =
    typeof options.getRuleBadges === "function" ? options.getRuleBadges : () => []

  const attempt = (withShortSummary) => {
    const items = (bundle ?? [])
      .map((item) => ({
        rel: normalizeRel(item.rel),
        frontmatter: item.frontmatter ?? {},
        content: item.content ?? "",
      }))
      .filter((i) => i.rel && i.rel.endsWith(".mdc"))
      .sort((a, b) => a.rel.localeCompare(b.rel))

    const groups = groupByTopSegment(items)
    const header = [title, "", headerIntro].join("\n").trimEnd()
    const router = renderRouter(groups, {
      getRuleRef,
      getRuleBadges,
      getOneLineDesc: (item) =>
        getOneLineDescription(item, { includeShortSummary: withShortSummary }),
    })
    return `${header}\n\n${router}\n`
  }

  const primary = attempt(includeShortSummary)

  if (primary.length <= maxChars) return primary

  if (includeShortSummary) {
    const downgraded = attempt(false)
    if (downgraded.length <= maxChars) return downgraded
  }

  if (onLimit === "truncate") {
    return primary.slice(0, maxChars)
  }

  throw new Error(
    `Index exceeded size budget: ${primary.length} > ${maxChars} chars. ` +
      "Reduce descriptions/summaries or increase maxChars.",
  )
}

function normalizeRel(rel) {
  const s = String(rel ?? "")
    .replace(/\\/g, "/")
    .replace(/^\/+/, "")
  return s.replace(/(^|\/)\.\.(?=\/|$)/g, "")
}

function defaultGetRuleRef(prefix) {
  return (rule) => `${prefix}${normalizeRel(rule.rel)}`
}

/** Root-level .mdc files to show under this segment instead of entrypoints (index only). */
const ROOT_FILE_TO_SEGMENT = { "tailwind.mdc": "styling" }

/** Root .mdc files that are first-class entrypoints; all other root files go to misc. */
const ENTRYPOINTS = new Set([
  "api.mdc",
  "bash.mdc",
  "core.mdc",
  "deploy.mdc",
  "frontend.mdc",
  "go.mdc",
  "javascript.mdc",
  "monorepo.mdc",
  "n8n.mdc",
  "nextjs.mdc",
  "php.mdc",
  "python.mdc",
  "react.mdc",
  "refactor.mdc",
  "rust.mdc",
  "typescript.mdc",
])

const MAX_DESCRIPTION_CHARS = 140

function groupByTopSegment(items) {
  /** @type {Record<string, Array<any>>} */
  const map = {}
  for (const item of items) {
    const parts = item.rel.split("/")
    let seg
    if (parts.length === 1) {
      if (ROOT_FILE_TO_SEGMENT[item.rel]) seg = ROOT_FILE_TO_SEGMENT[item.rel]
      else if (ENTRYPOINTS.has(item.rel)) seg = "entrypoints"
      else seg = "misc"
    } else {
      seg = parts[0]
    }
    map[seg] = map[seg] ?? []
    map[seg].push(item)
  }
  for (const seg of Object.keys(map)) {
    map[seg].sort((a, b) => a.rel.localeCompare(b.rel))
  }
  return map
}

function renderRouter(groups, { getRuleRef, getRuleBadges, getOneLineDesc }) {
  const segments = Object.keys(groups).sort((a, b) => {
    if (a === "entrypoints") return -1
    if (b === "entrypoints") return 1
    return a.localeCompare(b)
  })

  const lines = [
    "## Rules index (router)",
    "",
    "Each entry points to the source rule file. Content is intentionally not inlined here.",
    "",
    "### Sections",
    "",
    segments.join(" · "),
    "",
  ]

  for (const seg of segments) {
    lines.push(seg === "entrypoints" ? "### entrypoints (start here)" : `### ${seg}`)
    lines.push("")

    for (const item of groups[seg]) {
      const ref = getRuleRef(item)
      const description = getOneLineDesc(item)
      const primary = `- \`${ref}\` — ${description}`
      lines.push(primary)
      const badges = getRuleBadges(item)
      if (badges.length > 0) {
        lines.push(`  (${badges.join(", ")})`)
      }
    }

    lines.push("")
  }

  return lines.join("\n")
}

function getOneLineDescription(item, { includeShortSummary }) {
  const fm = item.frontmatter ?? {}
  const fromFrontmatter = toOneLine(fm.description || fm.overview || fm.title || fm.name || "")

  const raw = (() => {
    if (!includeShortSummary) return fromFrontmatter
    const fromBody = toOneLine(extractShortSummaryLine(item.content))
    return fromFrontmatter || fromBody
  })()

  const safe = raw || "No description provided."
  return truncate(safe, MAX_DESCRIPTION_CHARS)
}

function truncate(value, max) {
  const limit = Number.isFinite(max) ? max : MAX_DESCRIPTION_CHARS
  if (limit <= 0) return ""
  if (value.length <= limit) return value
  if (limit === 1) return "…"
  const cut = value.slice(0, limit - 1)
  const lastSpace = cut.lastIndexOf(" ")
  const safe = lastSpace > 40 ? cut.slice(0, lastSpace) : cut
  return `${safe.trimEnd()}…`
}

function toOneLine(value) {
  const s = String(value || "").trim()
  if (!s) return ""
  return s.replace(/\s+/g, " ")
}

function extractShortSummaryLine(content) {
  const text = String(content || "")
  const match = text.match(/##\s+Short summary\s*\n([\s\S]*?)(?=\n##\s|\n#\s|$)/i)
  if (!match) return ""

  const block = match[1] || ""
  const lines = block
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)

  const bullet = lines.find((l) => l.startsWith("- ") || l.startsWith("* "))
  if (bullet) return bullet.replace(/^[-*]\s+/, "")

  return lines[0] || ""
}

/** @typedef {{
 *   format?: string
 *   getRuleRef?: (rule: { rel: string, frontmatter: object, content: string }) => string
 *   getRuleLine?: (rule: object) => { primary: string, secondary?: string }
 *   onLimit?: "error" | "truncate"
 *   title?: string
 *   headerIntro?: string
 *   maxChars?: number
 *   includeShortSummary?: boolean
 *   referencePrefix?: string
 *   getRuleBadges?: (rule: object) => string[]
 * }} RenderIndexOnlyOptions */
