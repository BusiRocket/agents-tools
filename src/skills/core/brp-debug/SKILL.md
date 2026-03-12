---
name: brp-debug
description:
  Diagnose unexpected runtime errors, flaky behavior, failing checks with unclear cause, and
  performance regressions by collecting symptoms, testing hypotheses, isolating the fault, and only
  then changing code. Trigger when the task is to investigate or explain a problem before applying a
  fix. Do not use for straightforward bug fixes with an already-known cause, planned refactors, or
  final code review.
---

## Rules

- Always start with symptoms, not assumptions.
- Test hypotheses in order of likelihood (cheapest test first).
- Clean up all debug artifacts before delivering.

## Workflow

1. Capture the reported symptoms, error surface, and reproduction path.
2. Generate a short hypothesis list ordered by likelihood and test cost.
3. Run the minimum checks needed to isolate the true fault domain.
4. Apply the smallest corrective change only after the root cause is proven.
5. Verify the original symptom is gone and note remaining uncertainty.

## Output

- Return: symptoms, hypotheses tested, root cause, fix, verification.
- Load `references/debug-investigation-template.md` when the task needs a structured investigation.
