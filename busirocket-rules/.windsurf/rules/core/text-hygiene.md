---
description: "Text hygiene for docs/config (ASCII punctuation)"
alwaysApply: true
priority: high
---

# Text Hygiene (ASCII)

## Goal

Keep docs/config text easy to diff and safe for tooling.

## Rules

- Prefer ASCII punctuation in edited/new text.
- Use straight quotes (`'` and `"`) instead of smart quotes.
- Use ASCII hyphen (`-`) instead of long dashes.
- Avoid invisible/problematic characters (NBSP, zero-width chars).
- Keep edits minimal; do not reformat unrelated content.

## Output discipline

- If non-ASCII text hygiene issues are found, call them out explicitly.
- Preserve meaning while replacing problematic characters.
