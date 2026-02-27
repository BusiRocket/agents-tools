<!-- Antigravity Rule
Activation: Model Decision
Description: Tailwind tokens and theming strategy (semantic tokens + CSS variables)
-->

# Tailwind Tokens and Theming

- Prefer semantic tokens over hardcoded color utilities:
  - `bg-background`, `text-foreground`, `border-border`, `ring-ring`
- Prefer CSS variables as theme source of truth.
- Extend Tailwind config only with owned tokens.
- Avoid ad-hoc custom scales and random literal colors.
- For dark mode, prefer class-based switching (`.dark`) and token changes, not per-component hardcoded dark palettes.
