<!-- Antigravity Rule
Activation: Model Decision
Description: Next.js + React + styling (pages, components, hooks, Tailwind)
-->

# Frontend Rules

Use **@frontend** when working on UI, pages, components, or styling.

This rule references:

- **Next.js**: `.agent/rules/nextjs.mdc` — App Router architecture bundle
- **React**: `.agent/rules/react.mdc` — architecture, hooks, state, a11y, forms, performance
- **JavaScript** (optional): `.agent/rules/javascript.mdc` — extensions, QA, RN/Expo, Shopify JS, cross-runtime rules
- **Next.js**: `.agent/rules/nextjs/nextjs.mdc` — Server/Client components, special-file exports
- **Route handlers**: `.agent/rules/nextjs/route-handlers.mdc` — thin API handlers
- **Server actions**: `.agent/rules/nextjs/server-actions.mdc` — validation, typed result shapes, expected failures
- **Data fetching**: `.agent/rules/nextjs/data-fetching.mdc` — RSC-first fetch and waterfall prevention
- **Forms/actions**: `.agent/rules/nextjs/forms-and-actions.mdc` — form + action integration
- **Rendering/performance**: `.agent/rules/nextjs/rendering-performance.mdc` — dynamic imports, image/script strategy
- **Error/observability**: `.agent/rules/nextjs/error-observability.mdc` — boundaries and logging context
- **API responses**: `.agent/rules/nextjs/api-response-shapes.mdc` — JSON shapes, status codes
- **Tailwind**: `.agent/rules/tailwind.mdc` — Tailwind v4 standards split by concept
- **Bootstrap** (optional): `.agent/rules/styling/bootstrap.mdc` — responsive grid/components/utilities with accessibility
- **HTMX** (optional): `.agent/rules/javascript/htmx.mdc` — server-driven HTML fragments and declarative interactions
- **Vite runtime** (when using Vite): `.agent/rules/vite/runtime-safety.mdc` — no Node globals in browser bundles; use `import.meta.env`
- **Next.js + Supabase** (optional): `.agent/rules/integrations/nextjs-supabase.mdc` — auth/RLS and boundary-safe data access
- **Stripe subscriptions** (optional): `.agent/rules/integrations/stripe-subscriptions.mdc` — webhook safety and subscription sync
- **Payload CMS + Node** (optional): `.agent/rules/integrations/payload-cms.mdc` — content models, hooks, Mongo patterns, access control

## Short summary

- Server Components by default; `'use client'` only when needed.
- One component/hook per file; types in `types/`; helpers in `utils/`.
- Prefer Tailwind in `className`; avoid large custom CSS.
