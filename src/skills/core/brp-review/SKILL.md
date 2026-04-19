---
name: brp-review
description:
  Perform a findings-first self-review of code changes for bugs, regressions, missing tests,
  security risks, and maintainability issues before delivery. Trigger when implementation is done
  and the next step is to assess change quality like a strict reviewer. Do not use for planning,
  root-cause debugging, or writing the implementation itself.
allowed-tools: Read, Grep, Glob, Bash, TodoWrite
agent: brp-reviewer
---

## Rules

- Never skip the self-check, even for small changes.
- Be honest about limitations. Documenting them is better than hiding them.
- If critical issues are found, go back to `brp-implement` before delivering.

## Workflow

1. Review the change as if it were an incoming PR, not your own work.
2. Prioritize correctness, regressions, and security before style commentary.
3. Report concrete findings first with severity and evidence.
4. Call out missing validation, risky assumptions, and uncovered edges.
5. Summarize only after findings and open questions are clear.

## Output

- Return findings first, ordered by severity, with evidence and missing-test callouts.
- Load `references/review-severity-rubric.md` to keep severity assignment and tone consistent.
