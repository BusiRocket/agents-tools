---
description: "High priority: one symbol per file, one purpose per symbol, many small files. Single source of truth for code quality (creating and refactoring)."
alwaysApply: true
priority: high
---

# Code Quality Guidelines

**Apply these guidelines when creating new code and when refactoring.** They are the single source of truth; other rules (e.g. @refactor, post-refactor checks) reference this file.

## Golden rule (high priority)

- **One function or type per file** — exactly one exported symbol per file.
- **One purpose per function or type** — single responsibility; no multi-step or multi-concern symbols.
- **Very small files** — prefer 100 files of 10 lines over 1 file of 1000 lines.

## File size

- **Target**: 10–50 lines per file.
- **Max**: ~100 lines; beyond that, split.

## Hard constraints

- Exactly one exported symbol per file.
- No inline `interface`/`type` in non-type files; put types in `types/<area>/` (one type per file).
- No helper functions inside components/hooks; extract to `utils/<area>/`.
- No index/barrel files; import from concrete modules.
- **Single-purpose functions only**: each function does one task. If a function contains multiple steps (fetch/read/parse/transform/branching), split into smaller functions and orchestrate them from a parent function.

## Framework-specific exceptions

Any framework-specific exceptions to "one export per file" live in the framework rule files (e.g. Next.js).

## Constants and large data

- Do not keep large literal collections (arrays/maps of many entries) inside logic files.
- Extract keyword lists, lookup maps, and config tables to dedicated constant files (e.g. `utils/<area>/constants/xxxConstants.ts`); logic files import them.

## When to split (fast heuristics)

Split immediately if any is true:

- More than one exported symbol.
- More than one responsibility (UI + state + helpers).
- Any helper function inside a component/hook.
- Inline `type`/`interface` outside `types/`.
- File > ~80 lines and still growing.

## Extraction decision tree

- File > ~80 lines → must extract (multiple functions → one per file; inline types → `types/<area>/`; complex logic → hook or util; repeated JSX → child components).
- Large constant collections → dedicated files under `utils/<area>/constants/` or similar.

## Decision rules (creating and refactoring)

- Apply SOLID principles: single responsibility per file; depend on abstractions where it helps.
- If a file has multiple responsibilities, split immediately.
- If a hook/component contains helpers, extract them to `utils/`.
- If a file declares types inline, move them to `types/<area>/`.
- Limit logic in TSX to presentational concerns; move complex logic to hooks or `utils/`.
- Pass full props into components; avoid computing derived data during prop passing; keep logic inside the component or its hooks.
- If a function reads like a checklist of steps, split it into small single-purpose functions and keep a thin orchestrator.

## Checklist (after creating or refactoring)

- [ ] All type errors resolved.
- [ ] All lint errors resolved.
- [ ] No unused imports.
- [ ] No circular dependencies.
- [ ] File size 10–50 lines (max ~100).
- [ ] One function/type/hook per file.
- [ ] Types in `types/<area>/`; no index/barrel files.

## Common issues and fixes

| Issue               | Fix                                        |
| ------------------- | ------------------------------------------ |
| Type error: `any`   | Use `unknown` and narrow with type guards. |
| Unused import       | Remove or use the import.                  |
| Missing return type | Add explicit return type.                  |
| Circular dependency | Move shared types to `types/`.             |
| File too large      | Split into smaller focused files.          |
