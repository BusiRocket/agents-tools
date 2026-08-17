import { promises as fs } from "node:fs"
import { homedir } from "node:os"
import { join } from "node:path"
import { flagValue } from "../lib/machine/cli/flagValue"
import { resolveLearningDir } from "../lib/library/cli/resolveLearningDir"
import { classifyRouterOutcome } from "../lib/library/learning/classifyRouterOutcome"
import { laneFromContext } from "../lib/library/learning/laneFromContext"
import { formatRouterOutcomeLine } from "../lib/library/formatters/formatRouterOutcomeLine"
import { runRouterProbe } from "../lib/library/learning/runRouterProbe"
import type { RouterOutcome } from "../lib/library/learning/types/RouterOutcome"

export const main = async () => {
  const home = homedir()
  const asJson = process.argv.includes("--json")
  const learningFlag = flagValue(process.argv, "--learning")

  const learningDir = resolveLearningDir({
    ...(learningFlag === undefined ? {} : { flag: learningFlag }),
    env: process.env,
    home,
  })

  const routerPath =
    flagValue(process.argv, "--router") ?? join(process.cwd(), "src/hooks/utils/route_prompt.py")

  let phrases: Record<string, string[]>
  try {
    phrases = JSON.parse(
      await fs.readFile(join(learningDir, "trigger-phrases.json"), "utf8"),
    ) as Record<string, string[]>
  } catch {
    console.error(`no trigger-phrases.json under ${learningDir}; run library:triggers first`)
    process.exitCode = 1
    return
  }

  const outcomes: RouterOutcome[] = []

  for (const [skill, list] of Object.entries(phrases)) {
    for (const phrase of list) {
      const lane = laneFromContext(await runRouterProbe(routerPath, phrase))
      outcomes.push({
        skill,
        phrase,
        ...(lane === undefined ? {} : { lane }),
        verdict: classifyRouterOutcome(skill, lane),
      })
    }
  }

  const counts = {
    correct: outcomes.filter((outcome) => outcome.verdict === "correct-lane").length,
    wrong: outcomes.filter((outcome) => outcome.verdict === "wrong-lane").length,
    silent: outcomes.filter((outcome) => outcome.verdict === "no-lane").length,
  }

  if (!process.argv.includes("--dry-run")) {
    await fs.writeFile(
      join(learningDir, "router-audit.json"),
      `${JSON.stringify({ counts, outcomes }, null, 2)}\n`,
    )
  }

  console.log(
    asJson
      ? JSON.stringify({ counts, outcomes }, null, 2)
      : [
          `phrases probed: ${String(outcomes.length)}`,
          `  fired the right lane: ${String(counts.correct)}`,
          `  fired a different lane: ${String(counts.wrong)}`,
          `  fired nothing: ${String(counts.silent)}`,
          "",
          ...outcomes
            .filter((outcome) => outcome.verdict !== "correct-lane")
            .slice(0, 20)
            .map(formatRouterOutcomeLine),
        ].join("\n"),
  )
}
