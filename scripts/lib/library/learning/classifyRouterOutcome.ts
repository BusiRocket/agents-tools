import { LANE_SKILLS } from "./constants/LANE_SKILLS"
import type { RouterOutcome } from "./types/RouterOutcome"

export const classifyRouterOutcome = (
  skill: string,
  lane: string | undefined,
): RouterOutcome["verdict"] => {
  if (lane === undefined) {
    return "no-lane"
  }

  const owned = LANE_SKILLS[lane] ?? []

  return owned === "policy-only" || !owned.includes(skill) ? "wrong-lane" : "correct-lane"
}
