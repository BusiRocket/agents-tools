---
description: "TypeScript standards, type conventions, and refactor checks"
alwaysApply: false
priority: high
---

# TypeScript Rules

Use **@typescript** when writing or refactoring TypeScript.

This rule references:

- **Standards**: `.windsurf/rules/typescript/standards.mdc` - strict TS style, one export per file, Next.js exceptions
- **Types conventions**: `.windsurf/rules/typescript/types-conventions.mdc` - naming patterns and result shapes
- **Refactoring flow**: `.windsurf/rules/typescript/refactoring-typescript.mdc` - single source of truth for extraction/splitting
- **Post-change checks**: `.windsurf/rules/typescript/typescript-debug.mdc` - check order and failure handling

## Short summary

- Strict TypeScript, no `any`, explicit public API types.
- Keep types under `types/<area>/` with one type per file.
- Split large mixed-responsibility files early.