<!-- Antigravity Rule
Activation: Model Decision
Description: TypeScript + React standards (strict one-thing-per-file)
-->

# TypeScript + React Standards (strict)

## Goal

Optimize the codebase for agent context and long-term maintainability by enforcing **many small, focused files**.

## Language & Style

- Use `interface` for exported object contracts/props.
- Use `type` for unions and utility/mapped/conditional types.
- Prefer const objects or union types over enums.
- Prefer `function` keyword for exported functions; use arrow functions for short local callbacks.
- Import React members selectively (e.g. `import { useEffect } from 'react'`) rather than `import * as React`.
- Use `import type` for type-only imports.
- `const` by default; `let` only when necessary.
- Avoid `any`; prefer `unknown` at boundaries and narrow with type guards.
- English-only code, comments, and identifiers.
- Sort props alphabetically when feasible for consistency.
- Add brief comments for non-obvious variables; use JSDoc for exported functions (parameters and return type) when it improves discoverability.
- Use explicit return types for exported functions and public APIs.
- Prefer immutable data (`readonly`, `as const`) when values should not change.

## One Thing Per File (STRICT)

- **Exactly one exported symbol per file** for your own modules:
  - `.tsx`: one exported React component.
  - `.ts` (utils/services): one exported function.
  - `.ts` (types): one exported `interface` or `type`.
- **Single-purpose functions only**: if a function performs multiple tasks, split it and keep a thin orchestrator.

## Next.js Special-file Exceptions

Some Next.js files require additional exports by convention. Allowed exceptions:

- `app/**/layout.tsx`, `app/**/page.tsx`: `default export` + `metadata` / `generateMetadata` / `viewport` (etc.).
- `app/api/**/route.ts`: multiple HTTP method exports and route config exports.

## Types (STRICT)

- **No inline `interface`/`type` declarations** in components, hooks, utils, services, or route handlers.
- Put types in `types/<area>/...` as dedicated files.
- One type per file.

## Type Naming Patterns (recommended)

Use explicit names that communicate role:

- `XxxParams` / `XxxInput` for function inputs
- `XxxResult` for service results
- `XxxError` for domain error shapes
- `UseXxxParams` / `UseXxxReturn` for hook contracts
- `XxxProps` for component props
- For non-trivial function contracts, prefer RORO (`XxxInput` -> `XxxResult`).

## Result Shape for Expected Failures (recommended)

For boundaries that can fail (services), prefer a typed result object instead of throwing:

- `type XxxResult = { ok: true; value: T } | { ok: false; error: XxxError }`

## Helpers (STRICT)

- Do not keep helper functions inside components/hooks.
- If a helper is needed, extract it to `utils/<area>/SomeHelper.ts` (one function per file).

## Next.js TS Hygiene (docs-aligned)

- Do not edit `next-env.d.ts` (it is generated).
- If you need custom `.d.ts`, create a new file and include it in `tsconfig.json`.

## Validation

Run the project's check script after meaningful changes (e.g. `pnpm run check`, `npm run check`).