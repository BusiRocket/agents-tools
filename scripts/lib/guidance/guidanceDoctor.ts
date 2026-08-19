import { access, readFile } from "node:fs/promises"
import { join } from "node:path"
import { parseGuidancePolicy } from "./parseGuidancePolicy"

export const guidanceDoctor = async (options: {
  home: string
  canonicalDir: string
  stateDir: string
}): Promise<{ ok: boolean; findings: string[] }> => {
  const findings: string[] = []
  try {
    const policy = parseGuidancePolicy(
      JSON.parse(await readFile(join(options.canonicalDir, "policy.json"), "utf8")) as unknown,
    )
    if (!policy.ok) findings.push(...policy.errors)
  } catch {
    findings.push("policy.json is missing or invalid JSON")
  }
  for (const path of [
    join(options.home, ".claude", "CLAUDE.md"),
    join(options.home, ".codex", "AGENTS.md"),
  ]) {
    try {
      await access(path)
    } catch {
      findings.push(`missing live guidance: ${path.replace(options.home, "~")}`)
    }
  }
  try {
    await access(join(options.stateDir, "accepted.json"))
  } catch {
    findings.push("no accepted guidance run")
  }
  return { ok: findings.length === 0, findings }
}
