import { isSecretReference } from "../secrets/isSecretReference"
import { isAllowedLiteral } from "./isAllowedLiteral"

type ServerShape = {
  args?: unknown[]
  env?: Record<string, unknown>
  headers?: Record<string, unknown>
}

const checkValue = (location: string, value: unknown, findings: string[]) => {
  if (isSecretReference(value)) {
    return
  }

  if (typeof value !== "string") {
    findings.push(`${location} must be a string or a { from_env } reference`)
    return
  }

  if (!isAllowedLiteral(value)) {
    findings.push(`${location} looks like a credential literal; use { from_env: NAME } instead`)
  }
}

export const findCredentialLiterals = (server: ServerShape) => {
  const findings: string[] = []

  server.args?.forEach((value, index) => {
    checkValue(`args[${index}]`, value, findings)
  })

  for (const [key, value] of Object.entries(server.env ?? {})) {
    checkValue(`env.${key}`, value, findings)
  }

  for (const [key, value] of Object.entries(server.headers ?? {})) {
    checkValue(`headers.${key}`, value, findings)
  }

  return findings
}
