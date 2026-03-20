import { PYTHON } from "../constants/PYTHON"
import { pythonCmd } from "../constants/pythonCmd"
import { run } from "./run"
import { VENV_DIR } from "../constants/VENV_DIR"

// eslint-disable-next-line @typescript-eslint/require-await
export async function main() {
  console.log("Creating validation venv at .venv-validate ...")
  run(pythonCmd, ["-m", "venv", VENV_DIR])
  console.log("Installing skills-ref ...")
  run(PYTHON, ["-m", "pip", "install", "--quiet", "skills-ref"])
  console.log("Done. Run yarn validate to check all skills.")
}

// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error)
}
