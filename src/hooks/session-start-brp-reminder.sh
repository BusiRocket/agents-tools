#!/usr/bin/env bash
set -euo pipefail

# BRP SessionStart reminder.
# Injects a terse protocol reminder into the model's additional context via hookSpecificOutput.
# Exits 0 always; hook failure must never block session start.

cat <<'JSON'
{
  "hookSpecificOutput": {
    "hookEventName": "SessionStart",
    "additionalContext": "BRP workflow active. For non-trivial work: use /brp-plan before editing. Always include validation commands in deliverables. Use /brp-review as a final self-check. Each brp-* skill has its own allow-list for tools."
  }
}
JSON
