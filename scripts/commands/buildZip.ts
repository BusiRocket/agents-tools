import { spawnSync } from "node:child_process"
import path from "node:path"

export const buildZip = (sourceDir: string, targetZip: string) => {
  const parent = path.dirname(sourceDir)
  const folder = path.basename(sourceDir)
  // eslint-disable-next-line sonarjs/no-os-command-from-path
  const result = spawnSync("zip", ["-qr", targetZip, folder], {
    cwd: parent,
    stdio: "pipe",
    encoding: "utf8",
  })

  if (result.status !== 0) {
    throw new Error(result.stderr || result.stdout || `Failed to package ${sourceDir}`)
  }
}
