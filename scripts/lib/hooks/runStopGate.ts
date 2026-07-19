import { execFileSync } from "node:child_process"
import path from "node:path"
import { fileURLToPath } from "node:url"

/**
 * Run the Stop verification gate against a working directory and return the
 * block reason, or null when it stays silent.
 *
 * @param {string} cwd - Project directory the gate should inspect.
 * @param {boolean} edited - Whether the fake transcript records an edit this session.
 * @returns {string | null} - Reason the gate blocks on, or null when it allows the stop.
 */
export const runStopGate = (cwd: string, edited: boolean): string | null => {
  const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..")
  const hook = path.join(repoRoot, "src/hooks/stop-verification-gate.sh")
  const transcript = path.join(cwd, "transcript.jsonl")

  const raw = execFileSync("bash", [hook], {
    input: JSON.stringify({ cwd, transcript_path: transcript, stop_hook_active: "False" }),
    encoding: "utf8",
  }).trim()

  if (raw === "") return null
  const parsed = JSON.parse(raw) as { decision?: string; reason?: string }
  return parsed.decision === "block" ? (parsed.reason ?? "") : null
}
