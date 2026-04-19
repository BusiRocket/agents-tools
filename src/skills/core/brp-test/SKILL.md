---
name: brp-test
description:
  Design, add, or update validation for a change using deterministic tests and explicit manual
  checks when automation is not possible. Trigger when code exists and the next job is to prove
  correctness with unit, integration, end-to-end, or manual verification coverage. Do not use for
  planning the feature itself, debugging unclear failures, or final findings-first review.
allowed-tools: Read, Grep, Glob, Edit, Write, Bash, TodoWrite
---

## Rules

- Every implementation MUST have validation commands, even if no test framework exists.
- If no test framework is available, provide manual verification steps.
- Tests must be independent and deterministic.
- Prefer testing behavior over implementation details.

## Workflow

1. Identify the highest-risk behavior changes introduced by the implementation.
2. Choose the smallest reliable test layer that proves each behavior.
3. Add deterministic automated tests first; fall back to explicit manual checks when needed.
4. Provide runnable commands and note any setup gaps or constraints.
5. Report what is covered, what is not, and why.

## Output

- Return: test strategy, files added or changed, commands, remaining gaps, manual verification.
- Load `references/test-strategy-matrix.md` when deciding test depth or fallback coverage.
