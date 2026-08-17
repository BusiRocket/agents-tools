import { findCredentialLiterals } from "../../schemas/findCredentialLiterals"
import { MCP_TARGETS } from "./McpManifest"
import type { McpManifest, McpTarget } from "./McpManifest"

export type ParseResult = { ok: true; manifest: McpManifest } | { ok: false; errors: string[] }

const isTarget = (value: unknown): value is McpTarget =>
  typeof value === "string" && (MCP_TARGETS as readonly string[]).includes(value)

const collectTargetErrors = (name: string, targets: unknown, errors: string[]) => {
  if (!Array.isArray(targets) || targets.length === 0) {
    errors.push(`${name}: targets must be a non-empty array`)
    return
  }

  for (const target of targets) {
    if (!isTarget(target)) {
      errors.push(`${name}: unknown target ${String(target)}`)
    }
  }
}

const collectTransportErrors = (
  name: string,
  server: Record<string, unknown>,
  errors: string[],
) => {
  const transport = server["transport"]

  if (transport === "stdio") {
    if (typeof server["command"] !== "string") {
      errors.push(`${name}: stdio transport needs a command`)
    }
    if (server["url"] !== undefined) {
      errors.push(`${name}: stdio transport must not carry a url`)
    }
    return
  }

  if (transport === "http" || transport === "sse") {
    if (typeof server["url"] !== "string") {
      errors.push(`${name}: ${transport} transport needs a url`)
    }
    if (server["command"] !== undefined) {
      errors.push(`${name}: ${transport} transport must not carry a command`)
    }
    return
  }

  errors.push(`${name}: transport must be stdio, http or sse`)
}

export const parseMcpManifest = (raw: unknown): ParseResult => {
  if (typeof raw !== "object" || raw === null) {
    return { ok: false, errors: ["manifest must be an object"] }
  }

  const servers = (raw as Record<string, unknown>)["servers"]
  if (typeof servers !== "object" || servers === null) {
    return { ok: false, errors: ["manifest.servers must be an object"] }
  }

  const errors: string[] = []

  for (const [name, value] of Object.entries(servers as Record<string, unknown>)) {
    if (typeof value !== "object" || value === null) {
      errors.push(`${name}: server must be an object`)
      continue
    }

    const server = value as Record<string, unknown>
    collectTargetErrors(name, server["targets"], errors)
    collectTransportErrors(name, server, errors)

    for (const finding of findCredentialLiterals(
      server as Parameters<typeof findCredentialLiterals>[0],
    )) {
      errors.push(`${name}: ${finding}`)
    }
  }

  if (errors.length > 0) {
    return { ok: false, errors }
  }

  return { ok: true, manifest: raw as McpManifest }
}
