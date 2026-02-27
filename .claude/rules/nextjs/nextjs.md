# Next.js (App Router) Rules

## Server vs Client Components

- `app/**/page.tsx` and `app/**/layout.tsx` are **Server Components by default**.
- Use **Client Components** only when you need:
  - State and event handlers (`onClick`, `onChange`)
  - Effects (`useEffect`)
  - Browser-only APIs (`window`, `localStorage`, etc.)
- `'use client'` creates a **boundary**: the file and all of its imports become part of the client bundle.
  - Keep client islands small to reduce JS shipped to the browser.

## Passing Data

- Props passed from Server -> Client must be **serializable**.

## Route UX Files

- If a route fetches data or is non-trivial, include `loading.tsx` and `error.tsx` for consistent UX and error boundaries.
- Add `global-error.tsx` for app-level unexpected failures.

## Metadata APIs

- Prefer App Router metadata APIs (`metadata`, `generateMetadata`) over legacy `<Head />` patterns.

## Built-in Components

- Use `<Link />` for internal navigation.
- Use `<Image />` for user-facing images with explicit dimensions.
- Use `<Script />` for third-party scripts instead of ad-hoc script tags.

## Protecting Server-only Code

- Avoid importing server-only code (secrets, DB calls) into Client Components.
- If needed later, consider marking modules with `server-only` / `client-only` (optional).

## Caching intent

- Route/data caching must be explicit and intentional; avoid accidental stale behavior.

## Next Special Files: allowed extra exports

These rules enforce "one export per file" for your own modules, **but Next.js special files require extra exports**.

Allowed exceptions:

- `app/**/layout.tsx`, `app/**/page.tsx`: `default export` + `metadata` / `generateMetadata` / `viewport` (and similar Next file-convention exports).
- `app/api/**/route.ts`: multiple HTTP method exports (GET/POST/...) + route config exports.

## References

- Route Handlers: `.cursor/rules/nextjs/route-handlers.mdc`
- Server Actions: `.cursor/rules/nextjs/server-actions.mdc`
- Forms/Actions: `.cursor/rules/nextjs/forms-and-actions.mdc`
- Data Fetching: `.cursor/rules/nextjs/data-fetching.mdc`
- Rendering/Performance: `.cursor/rules/nextjs/rendering-performance.mdc`
- Error/Observability: `.cursor/rules/nextjs/error-observability.mdc`
- Boundaries: `.cursor/rules/core/boundaries.mdc`
