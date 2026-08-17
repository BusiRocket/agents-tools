export type NormalizedCodexServer = {
  command?: string
  args?: string[]
  url?: string
}

const unquote = (raw: string) => {
  const trimmed = raw.trim()

  if (trimmed.startsWith('"') && trimmed.endsWith('"') && trimmed.length >= 2) {
    return trimmed.slice(1, -1).replaceAll('\\"', '"').replaceAll("\\\\", "\\")
  }

  return trimmed
}

const parseArray = (raw: string) => {
  const inner = raw.trim().slice(1, -1).trim()

  if (inner === "") {
    return []
  }

  return inner.split(",").map((element) => unquote(element))
}

export const normalizeCodexServer = (
  record: Record<string, string>,
): NormalizedCodexServer => {
  const normalized: NormalizedCodexServer = {}

  const command = record["command"]
  if (command !== undefined) {
    normalized.command = unquote(command)
  }

  const args = record["args"]
  if (args !== undefined) {
    normalized.args = parseArray(args)
  }

  const url = record["url"]
  if (url !== undefined) {
    normalized.url = unquote(url)
  }

  return normalized
}
