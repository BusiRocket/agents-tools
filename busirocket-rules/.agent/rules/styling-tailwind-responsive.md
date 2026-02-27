<!-- Antigravity Rule
Activation: Model Decision
Description: Tailwind responsive strategy (mobile-first and breakpoint discipline)
-->

# Tailwind Responsive Strategy

- Mobile-first defaults, then progressive breakpoints:
  - `sm` -> `md` -> `lg` -> `xl` -> `2xl`
- Avoid breakpoint thrash on the same property unless justified.
- Prefer fluid primitives (`w-full`, `max-w-*`, `mx-auto`) before micro-managing every breakpoint.
