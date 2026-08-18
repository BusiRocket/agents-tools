import { parseTomlArray } from "./parseTomlArray"
import { normalizeCodexSubTable } from "./normalizeCodexSubTable"
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

  if (record.startup_timeout_sec !== undefined) {
    normalized.startup_timeout_sec = Number(record.startup_timeout_sec)
  }

  if (record.required !== undefined) {
    normalized.required = record.required === "true"
  }

  const httpHeaders = normalizeCodexSubTable(record, "http_headers")
  if (httpHeaders !== undefined) {
    normalized.http_headers = httpHeaders
  }

  const environmentHeaders = normalizeCodexSubTable(record, "env_http_headers")
  if (environmentHeaders !== undefined) {
    normalized.env_http_headers = environmentHeaders
  }

  return normalized
}
