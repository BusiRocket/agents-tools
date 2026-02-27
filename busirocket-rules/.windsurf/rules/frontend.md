---
description: "Next.js + React + styling (pages, components, hooks, Tailwind)"
alwaysApply: false
priority: high
---

# Frontend Rules

Use **@frontend** when working on UI, pages, components, or styling.

This rule references:

- **Next.js**: `.windsurf/rules/nextjs.mdc` — App Router architecture bundle
- **React**: `.windsurf/rules/react.mdc` — architecture, hooks, state, a11y, forms, performance
- **JavaScript** (optional): `.windsurf/rules/javascript.mdc` — extensions, QA, RN/Expo, Shopify JS, cross-runtime rules
- **Next.js**: `.windsurf/rules/nextjs/nextjs.mdc` — Server/Client components, special-file exports
- **Route handlers**: `.windsurf/rules/nextjs/route-handlers.mdc` — thin API handlers
- **Server actions**: `.windsurf/rules/nextjs/server-actions.mdc` — validation, typed result shapes, expected failures
- **Data fetching**: `.windsurf/rules/nextjs/data-fetching.mdc` — RSC-first fetch and waterfall prevention
- **Forms/actions**: `.windsurf/rules/nextjs/forms-and-actions.mdc` — form + action integration
- **Rendering/performance**: `.windsurf/rules/nextjs/rendering-performance.mdc` — dynamic imports, image/script strategy
- **Error/observability**: `.windsurf/rules/nextjs/error-observability.mdc` — boundaries and logging context
- **API responses**: `.windsurf/rules/nextjs/api-response-shapes.mdc` — JSON shapes, status codes
- **Tailwind**: `.windsurf/rules/tailwind.mdc` — Tailwind v4 standards split by concept
- **Bootstrap** (optional): `.windsurf/rules/styling/bootstrap.mdc` — responsive grid/components/utilities with accessibility
- **HTMX** (optional): `.windsurf/rules/javascript/htmx.mdc` — server-driven HTML fragments and declarative interactions
- **Vite runtime** (when using Vite): `.windsurf/rules/vite/runtime-safety.mdc` — no Node globals in browser bundles; use `import.meta.env`
- **Next.js + Supabase** (optional): `.windsurf/rules/integrations/nextjs-supabase.mdc` — auth/RLS and boundary-safe data access
- **Stripe subscriptions** (optional): `.windsurf/rules/integrations/stripe-subscriptions.mdc` — webhook safety and subscription sync
- **Payload CMS + Node** (optional): `.windsurf/rules/integrations/payload-cms.mdc` — content models, hooks, Mongo patterns, access control

## Short summary

- Server Components by default; `'use client'` only when needed.
- One component/hook per file; types in `types/`; helpers in `utils/`.
- Prefer Tailwind in `className`; avoid large custom CSS.
