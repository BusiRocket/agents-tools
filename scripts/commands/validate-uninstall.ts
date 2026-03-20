import { existsSync, rmSync } from "node:fs"
import { VENV_DIR } from "../constants/VENV_DIR"

// eslint-disable-next-line @typescript-eslint/require-await
export async function main() {
  if (!existsSync(VENV_DIR)) {
    console.log("No .venv-validate found. Nothing to remove.")
    process.exit(0)
  }
  rmSync(VENV_DIR, { recursive: true })
  console.log("Removed .venv-validate")
}

// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error)
}
