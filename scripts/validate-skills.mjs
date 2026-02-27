#!/usr/bin/env node
/**
 * Validates all skills under skills/ using the Agent Skills reference library.
 * Prefers the local venv from yarn validate:install, then pipx, then skills-ref on PATH.
 * See https://agentskills.io/specification#validation
 */

import { spawnSync } from "child_process"
import { existsSync, readdirSync } from "fs"
import { join } from "path"

const ROOT = process.cwd()
const SKILL_PARENTS = [
  join(ROOT, "skills", "stacks"),
  join(ROOT, "skills", "core"),
  join(ROOT, "skills", "orchestrator"),
]
const VENV_DIR = join(ROOT, ".venv-validate")
const VENV_BIN = join(VENV_DIR, process.platform === "win32" ? "Scripts" : "bin")
// skills-ref package installs the CLI as "agentskills"
const VENV_VALIDATOR = join(
  VENV_BIN,
  process.platform === "win32" ? "agentskills.exe" : "agentskills",
)

const INSTALL_HINT = `
To run validation, create the project venv (recommended):

  pnpm run validate:install

Then run:

  pnpm run skills:validate

Alternatively install globally: pip install skills-ref
Or use pipx: pipx run skills-ref validate path/to/skill

See https://github.com/agentskills/agentskills/tree/main/skills-ref
`

function getSkillDirs() {
  const dirs = []
  for (const parent of SKILL_PARENTS) {
    if (!existsSync(parent)) continue
    const children = readdirSync(parent, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => join(parent, d.name))
    dirs.push(...children)
  }
  if (dirs.length === 0) {
    console.error("No skill directories found under skills/")
    process.exit(1)
  }
  return dirs
}

function detectValidator(firstSkillPath) {
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
  const path = spawnSync("skills-ref", ["validate", firstSkillPath], {
    stdio: "pipe",
    encoding: "utf-8",
    shell: true,
  })
  if (path.status === 0) return "path"
  return null
}

function runValidate(skillPath, method) {
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

const skillDirs = getSkillDirs()
if (skillDirs.length === 0) {
  console.error("No skill directories found under skills/")
  process.exit(1)
}
const method = detectValidator(skillDirs[0])

if (!method) {
  console.error("skills-ref validator not found." + INSTALL_HINT)
  process.exit(1)
}

let failed = 0
for (const skillPath of skillDirs) {
  const skillName = skillPath.split(/[/\\]/).pop()
  const result = runValidate(skillPath, method)
  if (result.ok) {
    console.log(`✓ ${skillName}`)
  } else {
    console.error(`✗ ${skillName}`)
    if (result.stderr) console.error(result.stderr)
    failed++
  }
}

if (failed > 0) {
  process.exit(1)
}
console.log(`\nValidated ${skillDirs.length} skill(s).`)
