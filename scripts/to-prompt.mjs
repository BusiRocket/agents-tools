#!/usr/bin/env node
/**
 * Generates <available_skills> XML for all skills under dist/skills using skills-ref.
 */

import { spawnSync } from "child_process"
import { existsSync } from "fs"
import { join } from "path"
import { listSkillDirs } from "./lib/skills/listSkillDirs.mjs"

const ROOT = process.cwd()
const SKILLS_DIR = join(ROOT, "dist", "skills")
const VENV_DIR = join(ROOT, ".venv-validate")
const VENV_BIN = join(VENV_DIR, process.platform === "win32" ? "Scripts" : "bin")
const VENV_CLI = join(VENV_BIN, process.platform === "win32" ? "agentskills.exe" : "agentskills")

const INSTALL_HINT = `
To run to-prompt, create the project venv (recommended):

  pnpm run validate:install

Then run:

  pnpm run skills:prompt

Alternatively install globally: pip install skills-ref
Or use pipx: pipx run skills-ref to-prompt path/to/skill ...
`

function detectExecutor(firstSkillPath) {
  if (existsSync(VENV_CLI)) {
    const r = spawnSync(VENV_CLI, ["to-prompt", firstSkillPath], {
      stdio: "pipe",
      encoding: "utf-8",
    })
    if (r.status === 0) return "venv"
  }
  const pipx = spawnSync("pipx", ["run", "skills-ref", "to-prompt", firstSkillPath], {
    stdio: "pipe",
    encoding: "utf-8",
    shell: true,
  })
  if (pipx.status === 0) return "pipx"
  const global = spawnSync("skills-ref", ["to-prompt", firstSkillPath], {
    stdio: "pipe",
    encoding: "utf-8",
    shell: true,
  })
  if (global.status === 0) return "path"
  return null
}

function runToPrompt(skillPaths, method) {
  const args = ["to-prompt", ...skillPaths]
  if (method === "venv") {
    return spawnSync(VENV_CLI, args, {
      stdio: ["inherit", "inherit", "pipe"],
      encoding: "utf-8",
    })
  }
  if (method === "pipx") {
    return spawnSync("pipx", ["run", "skills-ref", "to-prompt", ...skillPaths], {
      stdio: ["inherit", "inherit", "pipe"],
      encoding: "utf-8",
      shell: true,
    })
  }
  return spawnSync("skills-ref", args, {
    stdio: ["inherit", "inherit", "pipe"],
    encoding: "utf-8",
    shell: true,
  })
}

const skillDirs = await listSkillDirs(SKILLS_DIR)
if (skillDirs.length === 0) {
  console.error("No skill directories found under dist/skills/")
  process.exit(1)
}

const method = detectExecutor(skillDirs[0])
if (!method) {
  console.error("skills-ref to-prompt not found." + INSTALL_HINT)
  process.exit(1)
}

const result = runToPrompt(skillDirs, method)
if (result.status !== 0) {
  if (result.stderr) console.error(result.stderr.trim())
  process.exit(result.status ?? 1)
}
