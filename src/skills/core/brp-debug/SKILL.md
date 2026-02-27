---
name: brp-debug
description:
  Structured debugging workflow. Analyze symptoms, form hypotheses, isolate the issue, and resolve.
  Use when investigating unexpected behavior, errors, or performance issues.
metadata:
  author: cristiandeluxe
  version: "1.0.0"
---

# Debug Skill

Structured debugging: symptoms → hypotheses → isolation → resolution.

## When to Use

Use `/brp-debug` when investigating:

- Runtime errors or crashes
- Unexpected behavior (logic bugs)
- Performance issues (memory leaks, slow queries)
- Environment-specific failures

## Workflow

### Step 1: Gather Symptoms

Collect all available information:

1. Error messages and stack traces
2. Steps to reproduce
3. When did it start? (check recent changes)
4. Is it consistent or intermittent?
5. What environment? (dev/staging/prod, OS, Node version)

### Step 2: Form Hypotheses

List 2–3 possible causes, ordered by likelihood:

```markdown
1. [Most likely] — [Reason this is likely] — [How to test]
2. [Second guess] — [Reason] — [How to test]
3. [Long shot] — [Reason] — [How to test]
```

### Step 3: Isolate

Test each hypothesis systematically:

- Add targeted logging or breakpoints
- Reduce the reproduction case to the minimum
- Binary search through recent commits if it's a regression
- Check external dependencies (API changes, package updates)

### Step 4: Resolve

Once the root cause is identified:

1. Apply the fix (use `brp-fix` workflow)
2. Remove debugging artifacts (console.logs, breakpoints)
3. Add tests to prevent regression
4. Document the root cause for future reference

## Output Format

```markdown
## Debug Report: [Issue]

### Symptoms

[What was observed]

### Hypotheses Tested

1. [Hypothesis] — [Result: confirmed/rejected]
2. [Hypothesis] — [Result]

### Root Cause

[Explanation]

### Resolution

[What was done to fix it]

### Prevention

[What test/check prevents recurrence]
```

## Rules

- Always start with symptoms, not assumptions.
- Test hypotheses in order of likelihood (cheapest test first).
- Clean up all debug artifacts before delivering.
