---
name: brp-review
description:
  Performs a structured self-check and mini PR review covering security, performance, and
  maintainability. Use as the final step before delivering any code changes.
metadata:
  author: cristiandeluxe
  version: "1.0.0"
---

# Review Skill

Final quality gate: self-check + mini PR review.

## When to Use

Use `/brp-review` as the last step of any task, after implementation and testing. Also use
standalone to review existing code or PRs.

## Workflow

### Step 1: Self-Check Checklist

Run through this checklist and report status:

- [ ] All acceptance criteria from the plan are met
- [ ] No unused imports or dead code
- [ ] No type errors (`tsc --noEmit` clean)
- [ ] No lint warnings (`eslint .` clean)
- [ ] File sizes within limits (10–100 lines target)
- [ ] One exported symbol per file
- [ ] Types in `types/<area>/`, not inline
- [ ] No TODO or placeholder code
- [ ] No hardcoded secrets or credentials

### Step 2: Security Review

- No user input rendered without sanitization (XSS)
- No secrets in source code or logs
- Authentication/authorization checked where needed
- Least privilege principle followed
- Dependencies have no known critical vulnerabilities

### Step 3: Performance Review

- No N+1 queries or unbounded loops
- No unnecessary re-renders in React components
- Large lists are paginated or virtualized
- Network requests have error handling and timeouts

### Step 4: Maintainability Review

- Clear, descriptive naming (no abbreviations)
- Single responsibility per file and function
- Dependencies flow in one direction (no circular imports)
- New patterns are consistent with existing codebase

### Step 5: Summary

Produce a brief summary:

```markdown
## Review Summary

**Changes**: [Brief description] **Files changed**: [Count] **Tests**: [Pass/fail status]

### Issues Found

- [Issue 1]: [Severity] — [Fix or note]

### Limitations

- [Known limitation]

### Next Steps

- [Suggested improvement]
```

## Rules

- Never skip the self-check, even for small changes.
- Be honest about limitations. Documenting them is better than hiding them.
- If critical issues are found, go back to `brp-implement` before delivering.
