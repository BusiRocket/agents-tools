# Tailwind State and Accessibility

- Interactive components must have visible `focus-visible` styles.
- Prefer ring-based focus over removing outlines.
- Disabled states should be explicit:
  - `disabled:opacity-50 disabled:pointer-events-none`
- Prefer `aria-*` and `data-*` variants for state-driven styling (especially Radix/Shadcn patterns).
- Do not hide information needed by assistive technology.
