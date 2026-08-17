export interface RouterOutcome {
  skill: string
  phrase: string
  lane?: string
  verdict: "correct-lane" | "wrong-lane" | "no-lane"
}
