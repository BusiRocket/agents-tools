import js from "@eslint/js"
import prettier from "eslint-config-prettier"
import globals from "globals"
import tseslint from "typescript-eslint"

import importPlugin from "eslint-plugin-import"
import unusedImports from "eslint-plugin-unused-imports"
import unicorn from "eslint-plugin-unicorn"
import sonarjs from "eslint-plugin-sonarjs"
import boundaries from "eslint-plugin-boundaries"
import codePolicy from "eslint-plugin-code-policy"
import checkFile from "eslint-plugin-check-file"

export default tseslint.config(
  {
    ignores: [
      ".agent/**",
      ".claude/**",
      ".cursor/**",
      ".windsurf/**",
      "*.md",
      "*.mdc",
      "**/node_modules/**",
      "eslint.config.*",
      "prettier.config.*",
      "rules/**",
      "agents-skills/**",
      "agent-skills/**",
      "busirocket-rules/**",
      "dist/**",
      "coverage/**",
    ],
  },
  js.configs.recommended,

  // Type-aware linting for TS files
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  codePolicy.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tseslint.parser,
      ecmaVersion: 2024,
      sourceType: "module",
      globals: {
        ...globals.node,
      },
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      "unicorn/filename-case": "off",
      // Hard bans / high-signal correctness
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-non-null-assertion": "error",

      // Promise correctness
      "@typescript-eslint/no-misused-promises": "error",
      "@typescript-eslint/no-floating-promises": "error",

      // Maintainability
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports", fixStyle: "separate-type-imports" },
      ],
      "@typescript-eslint/switch-exhaustiveness-check": "error",

      // Enforce the ONE file = ONE responsibility requested rule partially where possible here
      // The rest is handled manually/via ts-morph, but these unused rules help.
    },
  },

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
      "boundaries/elements": [
        { type: "scripts", pattern: "scripts/*" },
        { type: "lib", pattern: "scripts/lib/*" },
      ],
    },
    rules: {
      /**
       * Import hygiene
       */
      "import/first": "error",
      "import/newline-after-import": "error",
      "import/no-duplicates": "error",
      "import/no-cycle": ["error", { maxDepth: 1 }],
      "import/no-self-import": "error",

      /**
       * Unused imports/vars (hard fail)
       */
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

      /**
       * Unicorn: modern correctness / guardrails
       */
      "unicorn/no-abusive-eslint-disable": "error",
      "unicorn/prefer-node-protocol": "error",
      "unicorn/prefer-optional-catch-binding": "error",
      "unicorn/no-null": "off",
      "unicorn/prevent-abbreviations": "off",
      "unicorn/filename-case": "off",

      /**
       * SonarJS: bug patterns with high signal
       */
      ...sonarjs.configs.recommended.rules,
      "sonarjs/no-os-command-from-path": "off",

      /**
       * Architecture boundaries (folder-level dependency governance)
       */
      "boundaries/dependencies": [
        "error",
        {
          default: "allow",
          rules: [
            {
              from: [{ type: "scripts" }],
              allow: [{ to: { type: "scripts" } }, { to: { type: "lib" } }],
            },
            {
              from: [{ type: "lib" }],
              allow: [{ to: { type: "lib" } }, { to: { type: "scripts" } }],
            },
          ],
        },
      ],
    },
  },

  // Filename and folder naming conventions (check-file)
  {
    files: ["scripts/**/*.ts"],
    plugins: {
      "check-file": checkFile,
    },
    rules: {
      // bin/ entrypoints: kebab-case (run-compile-rules.ts)
      "check-file/filename-naming-convention": [
        "error",
        {
          "scripts/bin/*.ts": "KEBAB_CASE",
          // All other scripts: camelCase | PascalCase | SCREAMING_SNAKE_CASE
          "scripts/!(bin)/**/*.ts": "+([A-Z_a-z])*([A-Za-z0-9_])",
        },
      ],
      // All folders must be kebab-case
      "check-file/folder-naming-convention": [
        "error",
        {
          "scripts/**/": "KEBAB_CASE",
        },
      ],
    },
  },

  prettier,
)
