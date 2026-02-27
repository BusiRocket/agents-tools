<!-- Antigravity Rule
Activation: Model Decision
Description: TypeScript standards, type conventions, and refactor checks
-->

# TypeScript Rules

Use **@typescript** when writing or refactoring TypeScript.

This rule references:

- **Standards**: `.agent/rules/typescript/standards.mdc` - strict TS style, one export per file, Next.js exceptions
- **Types conventions**: `.agent/rules/typescript/types-conventions.mdc` - naming patterns and result shapes
- **Refactoring flow**: `.agent/rules/typescript/refactoring-typescript.mdc` - single source of truth for extraction/splitting
- **Post-change checks**: `.agent/rules/typescript/typescript-debug.mdc` - check order and failure handling

## Short summary

- Strict TypeScript, no `any`, explicit public API types.
- Keep types under `types/<area>/` with one type per file.
- Split large mixed-responsibility files early.
