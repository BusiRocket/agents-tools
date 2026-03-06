const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---/

/**
 * @param {string} content
 * @returns {{raw:string, lines:string[], fields:Map<string,string>} | null}
 */
export const parseFrontmatter = (content) => {
  const match = content.match(FRONTMATTER_RE)
  if (!match) return null

  const raw = match[1]
  const lines = raw.split(/\r?\n/)
  const fields = new Map()

  for (const line of lines) {
    const simple = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/)
    if (simple) {
      fields.set(simple[1], simple[2].trim())
    }
  }

  return { raw, lines, fields }
}

/**
 * Parse `description` preserving folded multiline block style used in SKILL.md files.
 * @param {string} frontmatterRaw
 * @returns {string}
 */
export const parseDescription = (frontmatterRaw) => {
  const lines = frontmatterRaw.split(/\r?\n/)
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (!line.startsWith("description:")) continue

    const initial = line.replace(/^description:\s*/, "").trim()
    if (initial.length > 0) return stripQuotes(initial)

    const values = []
    for (let j = i + 1; j < lines.length; j++) {
      const next = lines[j]
      if (/^[A-Za-z0-9_-]+:\s*/.test(next)) break
      if (next.trim().length === 0) break
      values.push(next.trim())
    }

    return values.join(" ").trim()
  }

  return ""
}

export const stripQuotes = (value) => value.replace(/^['"]|['"]$/g, "")

/**
 * @param {string} content
 * @returns {string}
 */
export const replaceFrontmatter = (content, nextFrontmatter) => {
  const match = content.match(FRONTMATTER_RE)
  if (!match) {
    return `---\n${nextFrontmatter}\n---\n\n${content.trimStart()}`
  }

  return content.replace(FRONTMATTER_RE, `---\n${nextFrontmatter}\n---`)
}
