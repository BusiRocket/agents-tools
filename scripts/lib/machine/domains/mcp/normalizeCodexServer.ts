import { parseTomlArray } from "./parseTomlArray"
import { unquoteTomlString } from "./unquoteTomlString"
import type { NormalizedCodexServer } from "./types/NormalizedCodexServer"

export const normalizeCodexServer = (record: Record<string, string>): NormalizedCodexServer => {
  const normalized: NormalizedCodexServer = {}

  if (record.command !== undefined) {
    normalized.command = unquoteTomlString(record.command)
  }

  if (record.args !== undefined) {
    normalized.args = parseTomlArray(record.args)
  }

  if (record.url !== undefined) {
    normalized.url = unquoteTomlString(record.url)
  }

  return normalized
}
