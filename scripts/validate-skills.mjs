#!/usr/bin/env node
import { spawnSync } from "node:child_process"
import { existsSync } from "node:fs"
import { promises as fs } from "node:fs"
import path from "node:path"
import { parseDescription, parseFrontmatter, stripQuotes } from "./lib/skills/frontmatter.mjs"
import { listSkillDirs } from "./lib/skills/listSkillDirs.mjs"
import { loadSkillRulesManifest, validateSkillRulesManifestShape } from "./lib/skills/manifest.mjs"
import { listFilesRecursive } from "./lib/fs/listFilesRecursive.mjs"

const ROOT = process.cwd()
const RULES_DIR = path.join(ROOT, "src", "rules")
const SRC_SKILLS_DIR = path.join(ROOT, "src", "skills")
const DIST_SKILLS_DIR = path.join(ROOT, "dist", "skills")
const MANIFEST_PATH = path.join(SRC_SKILLS_DIR, "skill-rules.map.json")
const VENV_DIR = path.join(ROOT, ".venv-validate")
const VENV_BIN = path.join(VENV_DIR, process.platform === "win32" ? "Scripts" : "bin")
const VENV_VALIDATOR = path.join(
  VENV_BIN,
  process.platform === "win32" ? "agentskills.exe" : "agentskills",
)

const RULES_INDEX_HEADING = "## Rules Index"
const RULES_INDEX_START = "<!-- GENERATED-RULES-INDEX:START -->"
const RULES_INDEX_END = "<!-- GENERATED-RULES-INDEX:END -->"

const INSTALL_HINT = `
To run validation, create the project venv (recommended):

  pnpm run validate:install

Then run:

  pnpm run skills:validate

Alternatively install globally: pip install skills-ref
Or use pipx: pipx run skills-ref validate path/to/skill
`

const ACTION_WORDS = new Set([
  "split",
  "extract",
  "refactor",
  "review",
  "fix",
  "debug",
  "plan",
  "test",
  "audit",
  "implement",
  "generate",
  "create",
  "update",
  "migrate",
])

const tokenize = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/[\s-]+/)
    .filter(Boolean)

const detectValidator = (firstSkillPath) => {
  if (existsSync(VENV_VALIDATOR)) {
    const r = spawnSync(VENV_VALIDATOR, ["validate", firstSkillPath], {
      stdio: "pipe",
      encoding: "utf-8",
    })
    if (r.status === 0) return "venv"
  }

  const pipx = spawnSync("pipx", ["run", "skills-ref", "validate", firstSkillPath], {
    stdio: "pipe",
    encoding: "utf-8",
    shell: true,
  })
  if (pipx.status === 0) return "pipx"

  const global = spawnSync("skills-ref", ["validate", firstSkillPath], {
    stdio: "pipe",
    encoding: "utf-8",
    shell: true,
  })
  if (global.status === 0) return "path"

  return null
}

const runValidate = (skillPath, method) => {
  if (method === "venv") {
    const r = spawnSync(VENV_VALIDATOR, ["validate", skillPath], {
      stdio: "pipe",
      encoding: "utf-8",
    })
    return { ok: r.status === 0, stderr: (r.stderr || "").trim() }
  }

  if (method === "pipx") {
    const r = spawnSync("pipx", ["run", "skills-ref", "validate", skillPath], {
      stdio: "pipe",
      encoding: "utf-8",
      shell: true,
    })
    return { ok: r.status === 0, stderr: (r.stderr || "").trim() }
  }

  const r = spawnSync("skills-ref", ["validate", skillPath], {
    stdio: "pipe",
    encoding: "utf-8",
    shell: true,
  })
  return { ok: r.status === 0, stderr: (r.stderr || "").trim() }
}

const parseOpenAiYaml = async (filePath) => {
  const content = await fs.readFile(filePath, "utf8")
  const interfaceLine = content.match(/^interface:\s*$/m)
  const displayName = content.match(/^\s{2}display_name:\s*(.+)\s*$/m)
  const shortDescription = content.match(/^\s{2}short_description:\s*(.+)\s*$/m)

  return {
    hasInterface: Boolean(interfaceLine),
    hasDisplayName: Boolean(displayName && displayName[1].trim().length > 0),
    hasShortDescription: Boolean(shortDescription && shortDescription[1].trim().length > 0),
  }
}

const countOccurrences = (content, pattern) => {
  let count = 0
  let start = 0
  for (;;) {
    const idx = content.indexOf(pattern, start)
    if (idx === -1) break
    count += 1
    start = idx + pattern.length
  }
  return count
}

const extractRulesIndexRules = (content) => {
  const start = content.indexOf(RULES_INDEX_START)
  const end = content.indexOf(RULES_INDEX_END)
  if (start === -1 || end === -1 || end < start) return null

  const inner = content.slice(start + RULES_INDEX_START.length, end)
  const lines = inner
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.startsWith("- "))
    .map((line) => line.slice(2).trim())

  return lines
}

const buildRuleRefSet = async () => {
  const files = await listFilesRecursive(RULES_DIR)
  const refs = new Set()
  for (const file of files) {
    if (!file.endsWith(".mdc")) continue
    const rel = path.relative(RULES_DIR, file).replace(/\\/g, "/")
    refs.add(`@rules/${rel}`)
  }
  return refs
}

const descriptionSpecificityWarning = (description) => {
  const words = tokenize(description)
  if (words.length < 8) {
    return "description may be too short; expected >= 8 words for reliable activation"
  }

  const hasActionWord = words.some((word) => ACTION_WORDS.has(word))
  if (!hasActionWord) {
    return "description may be too generic; include action terms like split/extract/refactor/fix"
  }

  return null
}

const semanticCoherenceWarning = (description, rules) => {
  const descriptionTokens = new Set(tokenize(description))
  const ruleTokens = new Set(
    rules
      .flatMap((rule) =>
        tokenize(rule.replace("@rules/", "").replace(".mdc", "").replace(/\//g, " ")),
      )
      .filter((token) => token.length > 2),
  )

  let overlap = 0
  for (const token of descriptionTokens) {
    if (ruleTokens.has(token)) overlap += 1
  }

  if (overlap === 0) {
    return "description may be semantically misaligned with mapped rules"
  }

  return null
}

const main = async () => {
  const hardErrors = []
  const warnings = []

  const manifest = await loadSkillRulesManifest(MANIFEST_PATH)
  const manifestShape = validateSkillRulesManifestShape(manifest)
  hardErrors.push(...manifestShape.errors)

  const validRuleRefs = await buildRuleRefSet()

  const srcSkillDirs = await listSkillDirs(SRC_SKILLS_DIR)
  if (srcSkillDirs.length === 0) {
    hardErrors.push("No source skills found under src/skills")
  }

  const distSkillDirs = await listSkillDirs(DIST_SKILLS_DIR)
  if (distSkillDirs.length === 0) {
    hardErrors.push("No compiled skills found under dist/skills")
  }

  const srcByName = new Map()
  for (const skillDir of srcSkillDirs) {
    const skillMdPath = path.join(skillDir, "SKILL.md")
    const relative = path.relative(SRC_SKILLS_DIR, skillDir).replace(/\\/g, "/")

    if (!existsSync(skillMdPath)) {
      hardErrors.push(`Missing SKILL.md in source skill: ${relative}`)
      continue
    }

    const content = await fs.readFile(skillMdPath, "utf8")
    const frontmatter = parseFrontmatter(content)

    if (!frontmatter) {
      hardErrors.push(`Missing frontmatter in ${relative}/SKILL.md`)
      continue
    }

    const fieldNames = Array.from(frontmatter.fields.keys())
    const unexpectedFields = fieldNames.filter((name) => name !== "name" && name !== "description")
    if (unexpectedFields.length > 0) {
      hardErrors.push(
        `Unexpected frontmatter fields in ${relative}/SKILL.md: ${unexpectedFields.join(", ")}`,
      )
    }

    const skillName = stripQuotes(frontmatter.fields.get("name") || "")
    if (!skillName) {
      hardErrors.push(`Missing frontmatter name in ${relative}/SKILL.md`)
      continue
    }

    if (!/^[a-z0-9-]+$/.test(skillName)) {
      hardErrors.push(`Skill name must be lowercase kebab-case: ${skillName}`)
    }

    const description = parseDescription(frontmatter.raw)
    if (!description) {
      hardErrors.push(`Missing frontmatter description in ${relative}/SKILL.md`)
    } else {
      const specificity = descriptionSpecificityWarning(description)
      if (specificity) warnings.push(`${skillName}: ${specificity}`)
    }

    if (content.includes(RULES_INDEX_START) || content.includes(RULES_INDEX_END)) {
      hardErrors.push(
        `${skillName}: source purity violation (generated rules index markers in source)`,
      )
    }

    if (content.includes("## Dynamic Rules Ecosystem")) {
      hardErrors.push(`${skillName}: source purity violation (legacy inline rules block in source)`)
    }

    const openAiPath = path.join(skillDir, "agents", "openai.yaml")
    if (!existsSync(openAiPath)) {
      hardErrors.push(`${skillName}: missing agents/openai.yaml`)
    } else {
      const openAi = await parseOpenAiYaml(openAiPath)
      if (!openAi.hasInterface) {
        hardErrors.push(`${skillName}: agents/openai.yaml missing 'interface' section`)
      }
      if (!openAi.hasDisplayName) {
        hardErrors.push(`${skillName}: agents/openai.yaml missing interface.display_name`)
      }
      if (!openAi.hasShortDescription) {
        hardErrors.push(`${skillName}: agents/openai.yaml missing interface.short_description`)
      }
    }

    const sourceFiles = await listFilesRecursive(skillDir)
    for (const file of sourceFiles) {
      if (file.endsWith(".zip")) {
        hardErrors.push(
          `${skillName}: source purity violation (packaging artifact in source): ${file}`,
        )
      }
    }

    srcByName.set(skillName, {
      dir: skillDir,
      relative,
      description,
      rules: manifest.skills[skillName]?.rules || [],
    })
  }

  for (const [skillName, entry] of Object.entries(manifest.skills || {})) {
    if (!srcByName.has(skillName)) {
      hardErrors.push(`Manifest entry '${skillName}' has no matching source skill`)
    }

    for (const ruleRef of entry.rules || []) {
      if (!validRuleRefs.has(ruleRef)) {
        hardErrors.push(`Manifest entry '${skillName}' references missing rule: ${ruleRef}`)
      }
    }

    if ((entry.rules || []).length > 10) {
      warnings.push(`${skillName}: mapped to ${(entry.rules || []).length} rules (recommended 3-8)`)
    }
    if ((entry.rules || []).length >= 12) {
      warnings.push(`${skillName}: exceeds 12 mapped rules; manual review recommended`)
    }
  }

  for (const [skillName, skill] of srcByName.entries()) {
    const semanticWarning = semanticCoherenceWarning(skill.description || "", skill.rules)
    if (semanticWarning) {
      warnings.push(`${skillName}: ${semanticWarning}`)
    }

    const distSkillDir = path.join(DIST_SKILLS_DIR, skill.relative)
    const distSkillMdPath = path.join(distSkillDir, "SKILL.md")

    if (!existsSync(distSkillMdPath)) {
      hardErrors.push(`${skillName}: missing compiled SKILL.md in dist (${skill.relative})`)
      continue
    }

    const distContent = await fs.readFile(distSkillMdPath, "utf8")

    const headingCount = countOccurrences(distContent, RULES_INDEX_HEADING)
    const startCount = countOccurrences(distContent, RULES_INDEX_START)
    const endCount = countOccurrences(distContent, RULES_INDEX_END)

    if (headingCount !== 1) {
      hardErrors.push(`${skillName}: Rules Index heading must appear exactly once in dist/skills`)
    }
    if (startCount !== 1 || endCount !== 1) {
      hardErrors.push(
        `${skillName}: generated rules index markers must appear exactly once in dist/skills`,
      )
    }

    if (distContent.includes("## Dynamic Rules Ecosystem")) {
      hardErrors.push(`${skillName}: legacy inline rules detected in compiled skill`)
    }

    const extractedRules = extractRulesIndexRules(distContent)
    if (!extractedRules) {
      hardErrors.push(`${skillName}: unable to parse rules index rules from compiled skill`)
      continue
    }

    const expectedRules = manifest.skills[skillName]?.rules || []
    if (extractedRules.length !== expectedRules.length) {
      hardErrors.push(
        `${skillName}: rules index length mismatch (expected ${expectedRules.length}, got ${extractedRules.length})`,
      )
      continue
    }

    for (let i = 0; i < expectedRules.length; i++) {
      if (expectedRules[i] !== extractedRules[i]) {
        hardErrors.push(
          `${skillName}: rules index mismatch at position ${i + 1} (expected ${expectedRules[i]}, got ${extractedRules[i]})`,
        )
      }
    }
  }

  if (hardErrors.length > 0) {
    console.error("Hard errors:")
    for (const error of hardErrors) {
      console.error(`- ${error}`)
    }
    if (warnings.length > 0) {
      console.error("\nWarnings:")
      for (const warning of warnings) {
        console.error(`- ${warning}`)
      }
    }
    process.exit(1)
  }

  // External spec validation on compiled artifacts
  const method = detectValidator(distSkillDirs[0])
  if (!method) {
    console.error("skills-ref validator not found." + INSTALL_HINT)
    process.exit(1)
  }

  let failed = 0
  for (const skillPath of distSkillDirs) {
    const skillName = path.basename(skillPath)
    const result = runValidate(skillPath, method)
    if (result.ok) {
      console.log(`✓ ${skillName}`)
    } else {
      console.error(`✗ ${skillName}`)
      if (result.stderr) console.error(result.stderr)
      failed += 1
    }
  }

  if (failed > 0) {
    process.exit(1)
  }

  if (warnings.length > 0) {
    console.warn("\nWarnings:")
    for (const warning of warnings) {
      console.warn(`- ${warning}`)
    }
  }

  console.log(`\nValidated ${distSkillDirs.length} compiled skill(s).`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
