import { TOML_KEY_VALUE_PATTERN } from "./constants/TOML_KEY_VALUE_PATTERN"

export const parseTomlServerSections = (contents: string, sectionPattern: RegExp) => {
  const servers: Record<string, Record<string, string>> = {}
  let current: string | undefined

  for (const line of contents.split("\n")) {
    const trimmed = line.trim()

    if (trimmed.startsWith("[")) {
      current = sectionPattern.exec(trimmed)?.[1]

      if (current !== undefined && servers[current] === undefined) {
        servers[current] = {}
      }
      continue
    }

    if (current === undefined) {
      continue
    }

    const keyValue = TOML_KEY_VALUE_PATTERN.exec(trimmed)
    const target = servers[current]

    if (keyValue?.[1] !== undefined && keyValue[2] !== undefined && target !== undefined) {
      target[keyValue[1]] = keyValue[2].trim()
    }
  }

  return servers
}
