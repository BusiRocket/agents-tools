<!-- Antigravity Rule
Activation: Model Decision
Description: When creating or refactoring – follow code quality guidelines
-->

# Refactoring TypeScript/React Code (strict)

When **creating** new code or **refactoring** existing code, follow the single source of truth:

- **[code-quality-guidelines.mdc](.agent/rules/core/code-quality-guidelines.mdc)** – file size (10–50 target, ~100 max), one export per file, types in `types/`, no helpers inside components/hooks, no index files, constants in dedicated files, when to split, decision rules, checklist, common issues.

For a **one-shot refactor** of the current file, use **@refactor** (see [file-refactor.mdc](.agent/rules/refactor/file-refactor.mdc)).