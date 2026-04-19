---
name: brp-docs
description:
  Generate or update technical documentation, specifications, and ADRs that explain the codebase,
  interfaces, or design decisions for future readers. Trigger when the task is to write README
  content, API docs, architecture overviews, or technical specs from code context with strong text
  hygiene and consistent engineering terminology. Do not use for implementing features, debugging
  runtime issues, or performing findings-first code review.
allowed-tools: Read, Grep, Glob, Edit, Write
---

## Rules

- Write for the reader who has never seen this code before.
- Keep documentation close to the code it describes.
- Avoid time-sensitive references ("recently", "in the next release").
- Use consistent terminology throughout the project.
- Include runnable examples wherever possible.
