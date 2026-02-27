import js from "@eslint/js"
import prettier from "eslint-config-prettier"
import globals from "globals"

export default [
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
    ],
  },
  js.configs.recommended,
  {
    files: ["scripts/**/*.mjs", "*.config.mjs"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        ...globals.node,
      },
    },
    rules: {
      "no-console": ["warn", { allow: ["warn", "error", "log"] }],
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    },
  },
  prettier,
]
