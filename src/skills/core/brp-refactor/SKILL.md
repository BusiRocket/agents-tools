---
name: brp-refactor
description:
  Safe refactoring workflow with quality gates. Ensures behavior is preserved while improving code
  structure. Use when restructuring, extracting, or simplifying existing code.
metadata:
  author: cristiandeluxe
  version: "1.0.0"
---

# Refactor Skill

Safe refactoring with behavior preservation and quality gates.

## When to Use

Use `/brp-refactor` when improving code structure without changing behavior: extracting functions,
splitting files, renaming, removing duplication, or simplifying logic.

## Workflow

### Step 1: Assess

Before refactoring:

1. Run existing tests and note current pass/fail status
2. Identify what code smells or quality issues exist
3. Define the goal of the refactoring (measurable)
4. Check if the refactor is blocked by other work

### Step 2: Plan the refactoring

- List specific changes (extract, rename, split, simplify)
- Ensure behavior is preserved (no feature changes)
- Identify files affected and their current test coverage
- Estimate risk per change

### Step 3: Execute incrementally

For each refactoring step:

1. Make one structural change at a time
2. Run tests after each change
3. If tests break, investigate — is the test wrong or the refactor?
4. Commit each working step

### Step 4: Post-refactor quality check

- [ ] All original tests still pass
- [ ] No new type errors
- [ ] No new lint warnings
- [ ] File sizes improved (closer to 10–50 lines target)
- [ ] One exported symbol per file
- [ ] No barrel/index files introduced
- [ ] Entry points unchanged (public API preserved)

## Rules

- **Never mix refactoring with feature changes.** These are separate tasks.
- **Tests must pass at every step.** If they don't, the refactor is wrong.
- **Preserve public interfaces.** Callers should not need to change.
- Run the full test suite before and after, and compare results.
