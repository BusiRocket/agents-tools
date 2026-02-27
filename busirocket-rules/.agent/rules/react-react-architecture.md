<!-- Antigravity Rule
Activation: Model Decision
Description: React + TypeScript architecture (App Router, strict file discipline)
-->

# React + TypeScript Architecture

## Defaults (App Router)

- Prefer **Server Components** by default.
- Add `'use client'` only when you need client-side state/effects/event handlers.
- Route handlers live in `app/api/**/route.ts` and must be thin (logic goes to `services/`).

## File Discipline (STRICT)

- One exported component per `.tsx`.
- No helper functions inside components.
- No inline types; import from `types/`.

## Splitting Guidance

- Repeated UI blocks (2+) -> extract a child component under `components/<area>/Parent/...`.
- Complex state/effects -> extract to `hooks/<area>/useXxx.ts`.
- Pure helpers -> `utils/<area>/xxx.ts`.
- External/data access -> `services/<area>/xxx.ts`.

## References

- Naming/layout: `.agent/rules/core/naming-and-layout.mdc`
- Boundaries: `.agent/rules/core/boundaries.mdc`
- TypeScript: `.agent/rules/typescript/standards.mdc`
