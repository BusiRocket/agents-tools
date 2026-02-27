<!-- Antigravity Rule
Activation: Model Decision
Description: Project guidelines (strict one-thing-per-file, many small files)
-->

# Project Guidelines

## Core Goal

Many small, focused files for maximum agent context efficiency.

## Strict File Discipline

- One exported component per `.tsx`.
- One exported hook per `hooks/**/useXxx.ts`.
- One exported function per `utils/**` and `services/**`.
- One exported type per `types/**`.
- No inline types outside `types/`.
- No helpers inside components/hooks.
- No index/barrel files.
- **Single-purpose functions only**: if a function does multiple tasks, split it and keep a thin orchestrator function.

## App Router Defaults (Next.js)

- Server Components by default.
- Add `'use client'` only when needed.
- Thin route handlers: `app/api/**/route.ts` -> call `services/`.
- Next.js special-file exceptions live in the Next.js rules.

## Quality Gate

- Run the project's check script after meaningful changes (e.g. `pnpm run check`, `npm run check`).

## References

- **When creating code**: follow [code-quality-guidelines.mdc](.agent/rules/core/code-quality-guidelines.mdc) (file size 10–50, one per file, types in `types/`, etc.).
- Naming/layout: `.agent/rules/core/naming-and-layout.mdc`
- Boundaries: `.agent/rules/core/boundaries.mdc`