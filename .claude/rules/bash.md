# Bash Rules

Use **@bash** when working on Bash or shell scripts.

This rule references:

- **Bash standards**: `.cursor/rules/bash/bash.mdc` — language, structure, functions, IO, layout, validation
- **Bash refactor**: `.cursor/rules/bash/refactor.mdc` — @file refactor workflow for .sh files

## Short summary

- One responsibility per script; entry scripts thin (parse + call helpers); helpers in `scripts/bash/utils/` or area subfolders.
- Validate with `bash -n` and `shellcheck` where possible.
