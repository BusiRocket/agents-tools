#!/usr/bin/env node
import { spawnSync } from "node:child_process"
import { promises as fs } from "node:fs"
import path from "node:path"
import { createHash } from "node:crypto"
import { listFilesRecursive } from "./lib/fs/listFilesRecursive.mjs"
import { parseDescription, parseFrontmatter, stripQuotes } from "./lib/skills/frontmatter.mjs"
import { listSkillDirs } from "./lib/skills/listSkillDirs.mjs"
import { loadSkillRulesManifest, validateSkillRulesManifestShape } from "./lib/skills/manifest.mjs"

const ROOT = process.cwd()
const SRC_SKILLS_DIR = path.join(ROOT, "src", "skills")
const DIST_SKILLS_DIR = path.join(ROOT, "dist", "skills")
const MANIFEST_PATH = path.join(SRC_SKILLS_DIR, "skill-rules.map.json")
const SCHEMA_PATH = path.join(ROOT, "scripts", "schemas", "skill-rules.map.schema.json")
const SNAPSHOT_DIR = path.join(ROOT, "scripts", "golden", "skills-rules-index")
const SMOKE_PATH = path.join(SRC_SKILLS_DIR, "activation-smoke.json")
const RULES_INDEX_START = "<!-- GENERATED-RULES-INDEX:START -->"
const RULES_INDEX_END = "<!-- GENERATED-RULES-INDEX:END -->"

const tokenize = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/[\s-]+/)
    .filter(Boolean)

const hashDirectory = async (dir) => {
  const hash = createHash("sha256")
  const files = await listFilesRecursive(dir)
  const sorted = files.sort((a, b) => a.localeCompare(b))

  for (const file of sorted) {
    const rel = path.relative(dir, file).replace(/\\/g, "/")
    const content = await fs.readFile(file)
    hash.update(rel)
    hash.update("\0")
    hash.update(content)
    hash.update("\0")
  }

  return hash.digest("hex")
}

const extractRules = (content) => {
  const start = content.indexOf(RULES_INDEX_START)
  const end = content.indexOf(RULES_INDEX_END)
  if (start === -1 || end === -1 || end < start) return []
  return content
    .slice(start + RULES_INDEX_START.length, end)
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.startsWith("- "))
    .map((line) => line.slice(2).trim())
}

const fail = (msg) => {
  console.error(`✗ ${msg}`)
  process.exit(1)
}

const pass = (msg) => {
  console.log(`✓ ${msg}`)
}

const main = async () => {
  if (
    !(await fs
      .stat(SCHEMA_PATH)
      .then(() => true)
      .catch(() => false))
  ) {
    fail(`Missing schema file at ${SCHEMA_PATH}`)
  }
  pass("schema file exists")

  const manifest = await loadSkillRulesManifest(MANIFEST_PATH)
  const manifestValidation = validateSkillRulesManifestShape(manifest)
  if (manifestValidation.errors.length > 0) {
    fail(`manifest shape invalid:\n- ${manifestValidation.errors.join("\n- ")}`)
  }
  pass("manifest shape is valid")

  if (
    !(await fs
      .stat(DIST_SKILLS_DIR)
      .then(() => true)
      .catch(() => false))
  ) {
    fail("dist/skills is missing; run pnpm run skills:compile first")
  }

  const beforeHash = await hashDirectory(DIST_SKILLS_DIR)
  const compileRun = spawnSync("node", ["scripts/compile-skills.mjs"], {
    stdio: "pipe",
    encoding: "utf8",
  })
  if (compileRun.status !== 0) {
    fail(
      `skills:compile failed during idempotence test:\n${compileRun.stderr || compileRun.stdout}`,
    )
  }
  const afterHash = await hashDirectory(DIST_SKILLS_DIR)
  if (beforeHash !== afterHash) {
    fail("skills:compile is not idempotent (dist/skills hash changed on second run)")
  }
  pass("skills:compile is idempotent")

  const srcFiles = await listFilesRecursive(SRC_SKILLS_DIR)
  for (const file of srcFiles) {
    if (file.endsWith(".zip")) {
      fail(`source purity violation: packaging artifact in source (${file})`)
    }
    if (!file.endsWith("SKILL.md")) continue
    const content = await fs.readFile(file, "utf8")
    if (content.includes(RULES_INDEX_START) || content.includes(RULES_INDEX_END)) {
      fail(`source purity violation: generated rules markers found in ${file}`)
    }
    if (content.includes("## Dynamic Rules Ecosystem")) {
      fail(`source purity violation: legacy inline rules block found in ${file}`)
    }
  }
  pass("source purity checks passed")

  const snapshots = ["brp-refactor", "brp-plan", "brp-review"]
  const skillDirs = await listSkillDirs(DIST_SKILLS_DIR)
  const distByName = new Map()
  for (const dir of skillDirs) {
    const content = await fs.readFile(path.join(dir, "SKILL.md"), "utf8")
    const fm = parseFrontmatter(content)
    if (!fm) continue
    const name = stripQuotes(fm.fields.get("name") || "")
    if (name) distByName.set(name, path.join(dir, "SKILL.md"))
  }

  for (const snapshotName of snapshots) {
    const skillPath = distByName.get(snapshotName)
    if (!skillPath) fail(`snapshot target missing in dist: ${snapshotName}`)

    const expectedPath = path.join(SNAPSHOT_DIR, `${snapshotName}.txt`)
    const expected = (await fs.readFile(expectedPath, "utf8"))
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)

    const actual = extractRules(await fs.readFile(skillPath, "utf8"))

    if (expected.length !== actual.length) {
      fail(
        `snapshot mismatch for ${snapshotName}: expected ${expected.length} rules, got ${actual.length}`,
      )
    }

    for (let i = 0; i < expected.length; i++) {
      if (expected[i] !== actual[i]) {
        fail(
          `snapshot mismatch for ${snapshotName} at line ${i + 1}: expected '${expected[i]}', got '${actual[i]}'`,
        )
      }
    }
  }
  pass("rules index snapshots passed")

  const smoke = JSON.parse(await fs.readFile(SMOKE_PATH, "utf8"))
  const srcSkillDirs = await listSkillDirs(SRC_SKILLS_DIR)
  const descriptions = new Map()
  for (const dir of srcSkillDirs) {
    const content = await fs.readFile(path.join(dir, "SKILL.md"), "utf8")
    const fm = parseFrontmatter(content)
    if (!fm) continue
    const name = stripQuotes(fm.fields.get("name") || "")
    const description = parseDescription(fm.raw)
    descriptions.set(name, description)
  }

  for (const [skillName, phrases] of Object.entries(smoke)) {
    const description = descriptions.get(skillName)
    if (!description) {
      fail(`smoke suite references unknown skill: ${skillName}`)
    }

    const descTokens = new Set(tokenize(description))
    const phraseHits = phrases.filter((phrase) => {
      const tokens = tokenize(phrase)
      return tokens.some((token) => descTokens.has(token))
    })

    if (phraseHits.length === 0) {
      fail(`smoke activation failed for ${skillName}: no phrase overlaps description tokens`)
    }
  }
  pass("activation smoke checks passed")

  console.log("\nAll skills tests passed.")
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
