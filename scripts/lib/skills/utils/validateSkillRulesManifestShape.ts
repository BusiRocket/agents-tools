// eslint-disable-next-line sonarjs/cognitive-complexity
export const validateSkillRulesManifestShape = (manifest: Record<string, unknown>) => {
  const errors: string[] = []
  const warnings: string[] = []

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!manifest || typeof manifest !== "object") {
    return { errors: ["Manifest must be a JSON object."], warnings }
  }

  if (!Number.isInteger(manifest.version)) {
    errors.push("Manifest field 'version' must be an integer.")
  }

  if (!manifest.skills || typeof manifest.skills !== "object" || Array.isArray(manifest.skills)) {
    errors.push("Manifest field 'skills' must be an object map.")
    return { errors, warnings }
  }

  for (const [skillName, entry] of Object.entries(manifest.skills)) {
    if (!entry || typeof entry !== "object" || Array.isArray(entry)) {
      errors.push(`Manifest entry '${skillName}' must be an object.`)
      continue
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (!Array.isArray(entry.rules)) {
      errors.push(`Manifest entry '${skillName}' must include a 'rules' array.`)
      continue
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (entry.rules.length === 0) {
      errors.push(`Manifest entry '${skillName}' must have at least one rule.`)
      continue
    }

    const seen = new Set()
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    for (const rule of entry.rules) {
      if (typeof rule !== "string" || rule.trim().length === 0) {
        errors.push(`Manifest entry '${skillName}' contains an empty rule reference.`)
        continue
      }

      if (!rule.startsWith("@rules/")) {
        errors.push(`Manifest entry '${skillName}' contains non @rules reference: ${rule}`)
      }

      if (seen.has(rule)) {
        errors.push(`Manifest entry '${skillName}' contains duplicate rule reference: ${rule}`)
      }
      seen.add(rule)
    }
  }

  return { errors, warnings }
}
