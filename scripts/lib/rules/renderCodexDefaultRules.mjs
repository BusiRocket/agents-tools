/**
 * Render the managed Codex exec-policy rules file.
 *
 * This project's reusable guidance for Codex primarily lives in AGENTS.md and
 * linked skills. The `.rules` file is still generated because Codex expects a
 * Starlark rules file at `~/.codex/rules/default.rules` for exec-policy rules.
 */
export const renderCodexDefaultRules = () =>
  [
    "# Managed by busirocket-agents-tools.",
    "#",
    "# This file intentionally starts with no prefix_rule() entries.",
    "# Add or accept Codex exec-policy rules here when you want to allow, prompt,",
    "# or forbid specific command prefixes outside the sandbox.",
    "#",
    "# Primary reusable guidance for this project lives in AGENTS.md and skills.",
    "",
  ].join("\n")
