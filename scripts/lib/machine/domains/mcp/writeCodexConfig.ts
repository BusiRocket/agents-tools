import { promises as fs } from "node:fs"

type WriteInput = {
  path: string
  toml: string
  ownedNames: string[]
  renderedNames: string[]
}

const SECTION = /^\[mcp_servers\.([^\].]+)(?:\.[^\]]+)?\]$/

export const writeCodexConfig = async ({
  path,
  toml,
  ownedNames,
  renderedNames,
}: WriteInput) => {
  let contents = ""
  try {
    contents = await fs.readFile(path, "utf8")
  } catch {
    contents = ""
  }

  const drop = new Set([...ownedNames, ...renderedNames])
  const kept: string[] = []
  let dropping = false

  for (const line of contents.split("\n")) {
    const trimmed = line.trim()

    if (trimmed.startsWith("[")) {
      const match = SECTION.exec(trimmed)
      dropping = match?.[1] !== undefined && drop.has(match[1])
    }

    if (!dropping) {
      kept.push(line)
    }
  }

  const body = kept.join("\n").trimEnd()
  const rendered = toml.trim()
  const next = rendered === "" ? `${body}\n` : `${body}\n\n${rendered}\n`

  await fs.writeFile(path, next)

  return renderedNames
}
