---
name: brp-code-quality
description:
  Audits and hardens a project's code-quality infrastructure. Covers TypeScript strict mode, ESLint
  flat config with typed linting, import hygiene, architecture boundaries, and runtime boundary
  safety. Use to bootstrap or audit any TypeScript/Next.js project.
metadata:
  author: cristiandeluxe
  version: "1.0.0"
---

# Code Quality Skill

Audit and harden a project's TypeScript, ESLint, import, and architecture quality gates.

## When to Use

Use `/brp-code-quality` to:

- Bootstrap code-quality tooling on a new project.
- Audit an existing project for missing quality gates.
- Harden an established codebase to 2026-grade standards.
- Run as a periodic quality check.

## Workflow

### Step 1: Audit

Detect the project stack and assess the current state:

1. **TypeScript**: Check `tsconfig.json` for `strict: true` and additional correctness flags.
2. **ESLint**: Check config format (flat `.ts`/`.mjs` vs legacy `.eslintrc`), installed plugins,
   type-aware linting.
3. **Scripts**: Check `package.json` for `lint`, `type-check`, and `test` scripts.
4. **Folder conventions**: Check for `src/app`, `src/features`, `src/shared`, `src/server`,
   `src/public`.
5. **Import hygiene**: Check for barrel files, deep imports across module boundaries, unused
   imports.

Report findings before making changes.

### Step 2: TypeScript Hardening

Ensure `tsconfig.json` has strict mode plus additional correctness flags:

```json
{
  "compilerOptions": {
    "target": "ES2024",
    "lib": ["DOM", "DOM.Iterable", "ES2024"],

    "strict": true,
    "noEmit": true,
    "incremental": true,

    "module": "ESNext",
    "moduleResolution": "Bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",

    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,

    "skipLibCheck": true,

    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitOverride": true,
    "useUnknownInCatchVariables": true,

    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    },

    "plugins": [{ "name": "next" }]
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts",
    ".next/dev/types/**/*.ts"
  ],
  "exclude": ["node_modules", "scripts"]
}
```

Key flags explained:

- `noUncheckedIndexedAccess`: Forces `T | undefined` for index signatures; prevents "undefined at
  runtime" bugs.
- `exactOptionalPropertyTypes`: Distinguishes `{ x?: string }` from `{ x: string | undefined }`;
  catches misuse of optional vs explicit undefined.
- `noImplicitOverride`: Requires `override` keyword on overridden methods; prevents silent breakage
  on base class changes.
- `useUnknownInCatchVariables`: Types `catch(e)` as `unknown` instead of `any`; forces explicit
  narrowing.

### Step 3: ESLint Hardening

Install dev dependencies (pnpm):

```bash
pnpm add -D \
  eslint \
  eslint-config-next \
  eslint-config-prettier \
  typescript \
  typescript-eslint \
  eslint-plugin-import \
  eslint-import-resolver-typescript \
  eslint-plugin-unused-imports \
  eslint-plugin-unicorn \
  eslint-plugin-sonarjs \
  eslint-plugin-boundaries
```

Create or replace `eslint.config.ts` (flat config):

```typescript
import nextVitals from "eslint-config-next/core-web-vitals"
import nextTs from "eslint-config-next/typescript"
import prettier from "eslint-config-prettier"
import { defineConfig, globalIgnores } from "eslint/config"

import importPlugin from "eslint-plugin-import"
import unusedImports from "eslint-plugin-unused-imports"
import unicorn from "eslint-plugin-unicorn"
import sonarjs from "eslint-plugin-sonarjs"
import boundaries from "eslint-plugin-boundaries"

import tseslint from "typescript-eslint"

const config = defineConfig([
  ...nextVitals,
  ...nextTs,

  globalIgnores([".next/**", "out/**", "build/**", "dist/**", "coverage/**", "next-env.d.ts"]),

  {
    settings: {
      react: { version: "19.0" },
    },
  },

  // Type-aware linting for TS files
  ...tseslint.config({
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-non-null-assertion": "error",

      "@typescript-eslint/no-misused-promises": "error",
      "@typescript-eslint/no-floating-promises": "error",

      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports", fixStyle: "separate-type-imports" },
      ],
      "@typescript-eslint/switch-exhaustiveness-check": "error",
    },
  }),

  // General JS/TS rules + plugins
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: {
      import: importPlugin,
      "unused-imports": unusedImports,
      unicorn,
      sonarjs,
      boundaries,
    },
    settings: {
      "import/resolver": {
        typescript: true,
      },
    },
    rules: {
      // Import hygiene
      "import/first": "error",
      "import/newline-after-import": "error",
      "import/no-duplicates": "error",
      "import/no-cycle": ["error", { maxDepth: 1 }],
      "import/no-self-import": "error",

      // "Public API only" imports
      "import/no-internal-modules": [
        "error",
        {
          forbid: ["@/**/**"],
          allow: ["@/**/index", "@/**/index.ts", "@/**/index.tsx", "@/**/styles/**", "@/**/*.css"],
        },
      ],

      // Unused imports/vars (hard fail)
      "unused-imports/no-unused-imports": "error",
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "unused-imports/no-unused-vars": [
        "error",
        {
          args: "after-used",
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],

      // Unicorn: modern correctness
      "unicorn/no-abusive-eslint-disable": "error",
      "unicorn/prefer-node-protocol": "error",
      "unicorn/prefer-optional-catch-binding": "error",
      "unicorn/no-null": "off",
      "unicorn/prevent-abbreviations": "off",
      "unicorn/filename-case": ["error", { cases: { camelCase: true, pascalCase: true } }],

      // SonarJS: bug patterns with high signal
      ...sonarjs.configs.recommended.rules,

      // Architecture boundaries
      "boundaries/element-types": [
        "error",
        {
          default: "disallow",
          rules: [
            { from: ["app"], allow: ["features", "shared", "public", "server"] },
            { from: ["features"], allow: ["features", "shared", "public", "server"] },
            { from: ["shared"], allow: ["shared", "public"] },
            { from: ["public"], allow: ["public", "shared"] },
            { from: ["server"], allow: ["server", "shared"] },
          ],
        },
      ],
    },
  },

  // Boundaries: map filesystem patterns to element types
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    settings: {
      "boundaries/elements": [
        { type: "app", pattern: "src/app/*" },
        { type: "features", pattern: "src/features/*" },
        { type: "shared", pattern: "src/shared/*" },
        { type: "server", pattern: "src/server/*" },
        { type: "public", pattern: "src/public/*" },
      ],
    },
  },

  // Runtime boundary: block server imports from client/public code
  {
    files: ["src/public/**/*.{ts,tsx}", "src/shared/ui/**/*.{ts,tsx}", "src/app/**/*.{ts,tsx}"],
    rules: {
      "import/no-restricted-paths": [
        "error",
        {
          zones: [
            {
              target: "./src/public",
              from: "./src/server",
              message:
                "public/* is browser-safe. Do not import server-only modules (src/server/*).",
            },
            {
              target: "./src/shared/ui",
              from: "./src/server",
              message: "shared/ui is client-safe. Do not import server-only modules.",
            },
          ],
        },
      ],
    },
  },

  // Runtime boundary: block client imports from server code
  {
    files: ["src/server/**/*.{ts,tsx}"],
    rules: {
      "import/no-restricted-paths": [
        "error",
        {
          zones: [
            {
              target: "./src/server",
              from: "./src/public",
              message: "server/* must not import browser-only modules (src/public/*).",
            },
            {
              target: "./src/server",
              from: "./src/shared/ui",
              message: "server/* must not import client UI modules (shared/ui).",
            },
          ],
        },
      ],
    },
  },

  // Prettier last (formatting conflicts off)
  prettier,
])

export default config
```

### Step 4: Folder Conventions

Verify or establish this folder structure:

```
src/
  app/**          -> Next.js App Router (pages, layouts, route handlers)
  features/*      -> Feature modules (vertical slices)
  shared/*        -> Cross-feature utilities/components (runtime-neutral)
  shared/ui/**    -> Client-safe UI primitives
  server/**       -> Server-only code (DB, secrets, server utils)
  public/**       -> Browser-only/shared UI safe modules (no Node APIs)
```

Each feature module exposes one `index.ts` as its public API:

```typescript
// src/features/auth/index.ts
export { LoginForm } from "./ui/LoginForm"
export type { AuthUser } from "./model/types"
export { signIn } from "./model/signIn"
```

Internal files remain internal — forbidden for cross-module imports by lint rules.

### Step 5: Runtime Boundaries

Verify these constraints are enforced (by the ESLint config above):

- `src/server/*` is the only place for `process.env` (beyond `NEXT_PUBLIC_*`), DB clients, `fs`,
  `crypto`.
- `src/public/*` is for browser-specific code: `window`, `document`, `localStorage`.
- `src/shared/*` must stay runtime-neutral unless explicitly under `shared/ui` (client-safe).
- Client/public code must never import from `src/server/*`.
- Server code must never import from `src/public/*` or `src/shared/ui/*`.

Preferred Next.js patterns:

- Server Actions (`'use server'`) for mutations.
- Route handlers (`src/app/api/**/route.ts`) for API boundaries.
- RSC (default server components) for server-only data fetching.
- Client components explicitly labeled with `'use client'`, importing only from `public/*` or
  `shared/ui/*`.

### Step 6: Quality Gate Scripts

Ensure `package.json` has these scripts:

```json
{
  "scripts": {
    "lint": "eslint .",
    "type-check": "tsc -p tsconfig.json --noEmit",
    "test": "vitest"
  }
}
```

Run all three and verify zero errors:

```bash
pnpm lint
pnpm type-check
pnpm test
```

### Step 7: Acceptance Criteria

Before declaring success:

- [ ] `pnpm lint` passes with zero warnings treated as errors.
- [ ] `pnpm type-check` passes.
- [ ] No deep imports remain outside module boundaries.
- [ ] Client/public code cannot import server-only modules (lint enforces).
- [ ] Server code cannot import browser-only modules (lint enforces).
- [ ] All `index.ts` entrypoints use named re-exports (no `export *`).

## Rules

- Always audit before making changes. Report findings first.
- Prefer incremental hardening over a big-bang rewrite.
- If the project uses npm or yarn instead of pnpm, adapt commands accordingly.
- If the project is not Next.js, skip Next.js-specific steps (runtime boundaries, app router
  conventions).
- The ESLint config is a template. Adapt `react.version`, path aliases, and boundary patterns to the
  actual project.
