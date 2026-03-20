import { FRONTMATTER_RE } from "../constants/FRONTMATTER_RE"

export interface Frontmatter {
  raw: string
  lines: string[]
  fields: Map<string, string>
}

export const parseFrontmatter = (content: string): Frontmatter | null => {
  // eslint-disable-next-line sonarjs/prefer-regexp-exec
  const match = content.match(FRONTMATTER_RE)
  if (!match) return null

  const raw = match[1]
  if (!raw) return null
  const lines = raw.split(/\r?\n/)
  const fields = new Map<string, string>()

  for (const line of lines) {
    // eslint-disable-next-line sonarjs/slow-regex
    const simple = /^([A-Za-z0-9_-]+):\s*(.*)$/.exec(line)

    if (simple?.[1] !== undefined && simple[2] !== undefined) {
      fields.set(simple[1], simple[2].trim())
    }
  }

  return { raw, lines, fields }
}
