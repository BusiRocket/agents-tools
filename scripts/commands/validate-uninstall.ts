import { existsSync, rmSync } from "node:fs"
import { VENV_DIR } from "../constants/VENV_DIR"

export function main() {
  if (!existsSync(VENV_DIR)) {
    console.log("No .venv-validate found. Nothing to remove.")
    process.exit(0)
  }
  rmSync(VENV_DIR, { recursive: true })
  console.log("Removed .venv-validate")
}

if (import.meta.url === `file://${String(process.argv[1])}`) {
  main()
}
