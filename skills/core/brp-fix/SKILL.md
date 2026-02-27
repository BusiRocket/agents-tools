---
name: brp-fix
description:
  Structured bugfix workflow. Reproduce the bug, form a hypothesis, apply a minimal fix, and verify.
  Use when fixing reported bugs or unexpected behavior.
metadata:
  author: cristiandeluxe
  version: "1.0.0"
---

# Fix Skill

Structured bugfix workflow: reproduce → hypothesize → fix → verify.

## When to Use

Use `/brp-fix` when addressing a reported bug, unexpected behavior, or test failure.

## Workflow

### Step 1: Reproduce

Before fixing, confirm the bug exists:

1. Identify the exact steps or input that triggers the bug
2. Note the expected vs actual behavior
3. Find the relevant code path
4. Check if there are related tests (and why they didn't catch it)

### Step 2: Hypothesize

Form a theory about the root cause:

- What component/function is responsible?
- What assumption is being violated?
- Is this a regression? Check git history.
- Could there be multiple causes?

### Step 3: Fix

Apply the minimal fix:

1. Change only what is necessary to fix the root cause
2. Do not refactor adjacent code (create a separate task for that)
3. Add a comment explaining why, if the fix is non-obvious
4. If the fix reveals a systemic issue, document it for a future task

### Step 4: Verify

1. Confirm the original reproduction case now works
2. Add or update tests to cover this case
3. Run the full test suite to check for regressions
4. Provide validation commands

## Output Format

```markdown
## Bug Fix: [Brief description]

### Reproduction

[Steps or input to reproduce]

### Root Cause

[Explanation of what went wrong and why]

### Fix

[Description of the change]

### Verification

- `[command 1]` — [what it checks]
- `[command 2]` — [what it checks]

### Tests Added

- [Test description]
```

## Rules

- Never fix without reproducing first. "I think this should fix it" is not enough.
- Minimal diff only. Bug fixes are not the time for refactoring.
- Always add a test for the case that was broken.
