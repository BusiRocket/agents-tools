---
description: "Tailwind performance and output hygiene"
alwaysApply: true
priority: high
---

# Tailwind Performance and Hygiene

- Keep markup clean; avoid unnecessary utility churn.
- Avoid heavy arbitrary values unless justified by design tokens.
- Remove unused style systems/component libraries when possible.
- For content-heavy pages, prioritize critical CSS path and lazy-load non-critical media/scripts.
