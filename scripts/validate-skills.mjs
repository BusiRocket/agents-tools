#!/usr/bin/env node
import { spawnSync } from "node:child_process"
import { existsSync } from "node:fs"
import { promises as fs } from "node:fs"
import path from "node:path"
import { parseDescription, parseFrontmatter, stripQuotes } from "./lib/skills/frontmatter.mjs"
import { listSkillDirs } from "./lib/skills/listSkillDirs.mjs"
import { loadSkillRulesManifest, validateSkillRulesManifestShape } from "./lib/skills/manifest.mjs"
import { parseOpenAiYaml } from "./lib/skills/openaiYaml.mjs"
import { listFilesRecursive } from "./lib/fs/listFilesRecursive.mjs"

const ROOT = process.cwd()
const RULES_DIR = path.join(ROOT, "src", "rules")
const SRC_SKILLS_DIR = path.join(ROOT, "src", "skills")
const DIST_SKILLS_DIR = path.join(ROOT, "dist", "skills")
const REPORTS_DIR = path.join(ROOT, "dist", "reports")
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

const VALID_SKILL_CLASSES = new Set(["workflow", "domain", "execution-assist"])

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

const descriptionBoundaryWarnings = (description) => {
  const warnings = []
  if (!/trigger when/i.test(description)) {
    warnings.push("description should include an explicit 'Trigger when ...' boundary")
  }
  if (!/do not use/i.test(description)) {
    warnings.push("description should include an explicit 'Do not use ...' boundary")
  }
  return warnings
}

const descriptionBoundaryErrors = (description) => {
  const errors = []
  if (!/trigger when/i.test(description)) {
    errors.push("description must include an explicit 'Trigger when ...' activation boundary")
  }
  if (!/do not use/i.test(description)) {
    errors.push("description must include an explicit 'Do not use ...' exclusion boundary")
  }
  return errors
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

const extractActivationSection = (description, startPattern, endPattern) => {
  const match = description.match(startPattern)
  if (!match) return ""
  const start = match.index + match[0].length
  const endMatch = description.slice(start).match(endPattern)
  const end = endMatch ? start + endMatch.index : description.length
  return description.slice(start, end).trim()
}

const activationSignature = (description) => {
  const trigger = extractActivationSection(description, /trigger when/i, /do not use/i)
  const exclusion = extractActivationSection(description, /do not use/i, /$/)
  const triggerTokens = new Set(tokenize(trigger).filter((token) => token.length > 2))
  const exclusionTokens = new Set(tokenize(exclusion).filter((token) => token.length > 2))
  return { triggerTokens, exclusionTokens }
}

const jaccardSimilarity = (left, right) => {
  const union = new Set([...left, ...right])
  if (union.size === 0) return 0

  let intersection = 0
  for (const token of left) {
    if (right.has(token)) intersection += 1
  }

  return intersection / union.size
}

const mentionsTooling = (content) =>
  /\bMCP\b|codex mcp|tool call|tool calls|remote MCP|OAuth/i.test(content)

const createSkillQuality = (skill) => ({
  name: skill.name,
  relativePath: skill.relative,
  skillClass: skill.skillClass,
  score: 100,
  warnings: [],
})

const addQualityWarning = (quality, warning, penalty = 5) => {
  quality.warnings.push(warning)
  quality.score = Math.max(0, quality.score - penalty)
}

const renderQualityMarkdown = (entries) => {
  const lines = ["# Skills Quality Report", ""]

  for (const entry of entries) {
    lines.push(`## ${entry.name}`)
    lines.push("")
    lines.push(`- path: ${entry.relativePath}`)
    lines.push(`- skillClass: ${entry.skillClass || "unknown"}`)
    lines.push(`- score: ${entry.score}`)
    if (entry.warnings.length === 0) {
      lines.push("- warnings: none")
    } else {
      lines.push("- warnings:")
      for (const warning of entry.warnings) {
        lines.push(`  - ${warning}`)
      }
    }
    lines.push("")
  }

  return `${lines.join("\n")}\n`
}

const main = async () => {
  const hardErrors = []
  const warnings = []
  const qualityEntries = []

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
      for (const error of descriptionBoundaryErrors(description)) {
        hardErrors.push(`${skillName}: ${error}`)
      }
      for (const warning of descriptionBoundaryWarnings(description)) {
        warnings.push(`${skillName}: ${warning}`)
      }
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
    let openAi = null
    if (!existsSync(openAiPath)) {
      hardErrors.push(`${skillName}: missing agents/openai.yaml`)
    } else {
      openAi = await parseOpenAiYaml(openAiPath)
      if (!openAi.interface.hasSection) {
        hardErrors.push(`${skillName}: agents/openai.yaml missing 'interface' section`)
      }
      if (!openAi.interface.displayName) {
        hardErrors.push(`${skillName}: agents/openai.yaml missing interface.display_name`)
      }
      if (!openAi.interface.shortDescription) {
        hardErrors.push(`${skillName}: agents/openai.yaml missing interface.short_description`)
      }

      if (!openAi.busirocket.hasSection) {
        hardErrors.push(`${skillName}: agents/openai.yaml missing 'busirocket' section`)
      }

      if (!VALID_SKILL_CLASSES.has(openAi.busirocket.skillClass)) {
        hardErrors.push(
          `${skillName}: agents/openai.yaml must set busirocket.skill_class to one of ${Array.from(
            VALID_SKILL_CLASSES,
          ).join(", ")}`,
        )
      }

      if (openAi.busirocket.skillClass === "workflow" && !openAi.interface.defaultPrompt) {
        warnings.push(`${skillName}: workflow skills should define interface.default_prompt`)
      }
      if (
        openAi.busirocket.skillClass === "workflow" &&
        openAi.policy.allowImplicitInvocation !== true
      ) {
        warnings.push(
          `${skillName}: workflow skills should set policy.allow_implicit_invocation: true`,
        )
      }
      if (openAi.busirocket.skillClass === "workflow" && !openAi.busirocket.failureMode) {
        warnings.push(`${skillName}: workflow skills should declare busirocket.failure_mode`)
      }
      if (
        openAi.busirocket.skillClass === "execution-assist" &&
        openAi.dependencies.toolDependencyCount === 0
      ) {
        warnings.push(
          `${skillName}: execution-assist skills should declare dependencies.tools when they rely on tools`,
        )
      }
      if (openAi.interface.defaultPrompt && openAi.interface.defaultPrompt.length < 20) {
        warnings.push(`${skillName}: interface.default_prompt should be descriptive, not a label`)
      }
    }

    const skillFiles = await listFilesRecursive(skillDir)
    for (const file of skillFiles) {
      if (file.endsWith(".zip")) {
        hardErrors.push(
          `${skillName}: source purity violation (packaging artifact in source): ${file}`,
        )
      }
    }

    const hasReferencesDir = skillFiles.some((file) => file.includes("/references/"))
    const quality = createSkillQuality({
      name: skillName,
      relative,
      skillClass: openAi?.busirocket.skillClass || "",
    })

    const specificity = description ? descriptionSpecificityWarning(description) : null
    if (specificity) addQualityWarning(quality, specificity, 8)
    for (const warning of descriptionBoundaryWarnings(description || "")) {
      addQualityWarning(quality, warning, 10)
    }
    if (openAi?.busirocket.skillClass === "workflow" && !openAi.interface.defaultPrompt) {
      addQualityWarning(quality, "workflow skill missing interface.default_prompt", 6)
    }
    if (
      openAi?.busirocket.skillClass === "workflow" &&
      openAi.policy.allowImplicitInvocation !== true
    ) {
      addQualityWarning(quality, "workflow skill should opt into implicit invocation", 6)
    }
    if (openAi?.busirocket.skillClass === "workflow" && !openAi.busirocket.failureMode) {
      addQualityWarning(quality, "workflow skill missing failure_mode guidance", 6)
    }
    if (mentionsTooling(content) && (!openAi || openAi.dependencies.toolDependencyCount === 0)) {
      warnings.push(`${skillName}: mentions MCP/tool usage but does not declare dependencies.tools`)
      addQualityWarning(quality, "mentions MCP/tool usage without dependencies.tools", 8)
    }
    if (openAi?.busirocket.requiresReferences === true && !hasReferencesDir) {
      warnings.push(`${skillName}: complex workflow skill should include references/ content`)
      addQualityWarning(quality, "complex workflow skill missing references/", 10)
    }

    qualityEntries.push(quality)

    srcByName.set(skillName, {
      dir: skillDir,
      relative,
      description,
      rules: manifest.skills[skillName]?.rules || [],
      skillClass: openAi?.busirocket.skillClass || "",
      quality,
      activation: activationSignature(description || ""),
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
      addQualityWarning(skill.quality, semanticWarning, 8)
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

  const workflowSkills = Array.from(srcByName.values()).filter(
    (skill) => skill.skillClass === "workflow",
  )
  for (let i = 0; i < workflowSkills.length; i++) {
    for (let j = i + 1; j < workflowSkills.length; j++) {
      const left = workflowSkills[i]
      const right = workflowSkills[j]
      const similarity = jaccardSimilarity(
        left.activation.triggerTokens,
        right.activation.triggerTokens,
      )
      if (similarity >= 0.45) {
        const message = `activation collision risk with ${right.relative} (trigger-token similarity ${similarity.toFixed(2)})`
        warnings.push(`${left.relative}: ${message}`)
        warnings.push(
          `${right.relative}: activation collision risk with ${left.relative} (trigger-token similarity ${similarity.toFixed(2)})`,
        )
        addQualityWarning(left.quality, message, 12)
        addQualityWarning(
          right.quality,
          `activation collision risk with ${left.relative} (trigger-token similarity ${similarity.toFixed(2)})`,
          12,
        )
      }
    }
  }

  await fs.mkdir(REPORTS_DIR, { recursive: true })
  const qualityJsonPath = path.join(REPORTS_DIR, "skills-quality-report.json")
  const qualityMdPath = path.join(REPORTS_DIR, "skills-quality-report.md")
  const qualityPayload = {
    generatedAt: new Date().toISOString(),
    skills: qualityEntries
      .slice()
      .sort((a, b) => a.score - b.score || a.name.localeCompare(b.name)),
  }
  await fs.writeFile(qualityJsonPath, `${JSON.stringify(qualityPayload, null, 2)}\n`, "utf8")
  await fs.writeFile(qualityMdPath, renderQualityMarkdown(qualityPayload.skills), "utf8")

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

  console.log(`Quality report: ${qualityMdPath}`)
  console.log(
    "Validation coverage: discovery shape, activation quality, and compiled artifact spec.",
  )
  console.log(`\nValidated ${distSkillDirs.length} compiled skill(s).`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
