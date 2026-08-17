import type { SecretReference } from "./SecretReference"

export type ResolvedReference = { resolved: true; value: string } | { resolved: false; name: string }

export const resolveReference = (
  reference: SecretReference,
  env: NodeJS.ProcessEnv,
): ResolvedReference => {
  const value = env[reference.from_env]
  if (value) {
    return { resolved: true, value }
  }

  return { resolved: false, name: reference.from_env }
}
