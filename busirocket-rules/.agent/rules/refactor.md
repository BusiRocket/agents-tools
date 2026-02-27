<!-- Antigravity Rule
Activation: Model Decision
Description: Refactor workflow — @refactor, TypeScript refactoring
-->

# Refactor Rules

Use **@refactor** when refactoring a file or splitting code.

This rule references:

- **Refactor current file**: `.agent/rules/refactor/file-refactor.mdc` — one symbol per file, no inline types/helpers; run check after
- **TypeScript refactoring**: `.agent/rules/typescript/refactoring-typescript.mdc` — move types to `types/`, helpers to `utils/`, no index files

## Short summary

- One exported symbol per file; extract types to `types/`, helpers to `utils/`.
- Mandatory: run project check script after refactor.
