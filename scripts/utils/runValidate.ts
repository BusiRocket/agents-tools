import { spawnSync } from "node:child_process"
import { VENV_VALIDATOR } from "../constants/VENV_VALIDATOR"

export const runValidate = (skillPath: string, method: string) => {
  if (method === "venv") {
    const r = spawnSync(VENV_VALIDATOR, ["validate", skillPath], {
      stdio: "pipe",
      encoding: "utf-8",
    })
    return { ok: r.status === 0, stderr: (r.stderr || "").trim() }
  }

  if (method === "pipx") {
    // eslint-disable-next-line sonarjs/no-os-command-from-path
    const r = spawnSync("pipx", ["run", "skills-ref", "validate", skillPath], {
      stdio: "pipe",
      encoding: "utf-8",
      shell: true,
    })
    return { ok: r.status === 0, stderr: (r.stderr || "").trim() }
  }

  // eslint-disable-next-line sonarjs/no-os-command-from-path
  const r = spawnSync("skills-ref", ["validate", skillPath], {
    stdio: "pipe",
    encoding: "utf-8",
    shell: true,
  })
  return { ok: r.status === 0, stderr: (r.stderr || "").trim() }
}
