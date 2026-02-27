# Boundaries & Placement (agent-optimized)

## Goal

Make it obvious where new code belongs so agents can create **many small files** without guessing.

## Decision Tree (Next.js App Router layout)

If you are writing...

- **A route or page** -> `app/**` (route components, layouts, route handlers)
- **Reusable UI** -> `components/<area>/...`
- **State/effects + orchestration logic** -> `hooks/<area>/useXxx.ts`
- **Pure logic** (no React, no IO) -> `utils/<area>/xxx.ts`
- **External boundary** (network/DB/auth/storage) -> `services/<area>/xxx.ts`
- **A shared shape** -> `types/<area>/Xxx.ts`

## Hard Rules

- **One exported symbol per file** (component / hook / function / type).
- **No inline types** outside `types/`.
- **No helpers inside components/hooks**; helpers go to `utils/`.
- **Route handlers must be thin**: validate input, call a `services/` function, return a response.

## References

- Next.js: `.cursor/rules/nextjs/nextjs.mdc`
- Route handlers: `.cursor/rules/nextjs/route-handlers.mdc`
- API response shapes: `.cursor/rules/nextjs/api-response-shapes.mdc`
- Validation: `.cursor/rules/api/validation.mdc`
- Naming/layout: `.cursor/rules/core/naming-and-layout.mdc`
- utils vs services: `.cursor/rules/backend/services-and-utils.mdc`
- Anti-patterns: `.cursor/rules/core/anti-patterns.mdc`
