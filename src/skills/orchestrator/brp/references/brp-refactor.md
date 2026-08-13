# brp-refactor (workflow reference)

Refactors existing code into cleaner structure without changing behavior by splitting files,
extracting helpers, and preserving public interfaces with tight validation. Use when the goal is
structural improvement with no feature change. Not for shipping new behavior, fixing unknown bugs,
or final quality review of already-finished work.

## Rules

- **Never mix refactoring with feature changes.** These are separate tasks.
- **Tests must pass at every step.** If they don't, the refactor is wrong.
- **Preserve public interfaces.** Callers should not need to change.
- The structural bar is the BusiRocket baseline: atomic files (one exported unit per file), explicit
  boundaries, and the loaded code-quality rules. Repo-wide gates and the agent-ready documentation
  standard are `brp-code-quality`'s job; do not bootstrap them mid-refactor.

## Workflow

1. Run the test suite and record the passing baseline; a red baseline blocks the refactor.
2. Map the responsibilities in the target and decide the extraction order.
3. Apply one structural change at a time (split, extract, rename), fixing imports as you go.
4. Re-run the tests after each step and compare against the baseline; revert the step if results
   diverge.
5. Finish with the full project check.

## Output

- Return: files created, moved, or changed, the before/after test results, and confirmation that
  public interfaces and behavior are unchanged.
