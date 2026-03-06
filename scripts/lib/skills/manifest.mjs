import { promises as fs } from "node:fs"

/** @typedef {{version:number, skills: Record<string,{rules:string[]}>}} SkillRulesManifest */

/**
 * @param {string} filePath
 * @returns {Promise<SkillRulesManifest>}
 */
export const loadSkillRulesManifest = async (filePath) => {
  const raw = await fs.readFile(filePath, "utf8")
  return JSON.parse(raw)
}

/**
 * @param {SkillRulesManifest} manifest
 * @returns {{errors:string[], warnings:string[]}}
 */
export const validateSkillRulesManifestShape = (manifest) => {
  const errors = []
  const warnings = []

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

    if (!Array.isArray(entry.rules)) {
      errors.push(`Manifest entry '${skillName}' must include a 'rules' array.`)
      continue
    }

    if (entry.rules.length === 0) {
      errors.push(`Manifest entry '${skillName}' must have at least one rule.`)
      continue
    }

    const seen = new Set()
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
