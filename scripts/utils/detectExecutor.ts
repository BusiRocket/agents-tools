import { spawnSync } from "node:child_process"
import { existsSync } from "node:fs"
import { VENV_CLI } from "../constants/VENV_CLI"

export function detectExecutor(firstSkillPath: string) {
  if (existsSync(VENV_CLI)) {
    const r = spawnSync(VENV_CLI, ["to-prompt", firstSkillPath], {
      stdio: "pipe",
      encoding: "utf-8",
    })
    if (r.status === 0) return "venv"
  }

  // eslint-disable-next-line sonarjs/no-os-command-from-path
  const pipx = spawnSync("pipx", ["run", "skills-ref", "to-prompt", firstSkillPath], {
    stdio: "pipe",
    encoding: "utf-8",
    shell: true,
  })
  if (pipx.status === 0) return "pipx"
  // eslint-disable-next-line sonarjs/no-os-command-from-path
  const global = spawnSync("skills-ref", ["to-prompt", firstSkillPath], {
    stdio: "pipe",
    encoding: "utf-8",
    shell: true,
  })
  if (global.status === 0) return "path"
  return null
}
