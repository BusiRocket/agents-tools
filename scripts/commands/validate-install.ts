import { PYTHON } from "../constants/PYTHON"
import { pythonCmd } from "../constants/pythonCmd"
import { run } from "./run"
import { VENV_DIR } from "../constants/VENV_DIR"

export function main() {
  console.log("Creating validation venv at .venv-validate ...")
  run(pythonCmd, ["-m", "venv", VENV_DIR])
  console.log("Installing skills-ref ...")
  run(PYTHON, ["-m", "pip", "install", "--quiet", "skills-ref"])
  console.log("Done. Run yarn validate to check all skills.")
}

if (import.meta.url === `file://${String(process.argv[1])}`) {
  main()
}
