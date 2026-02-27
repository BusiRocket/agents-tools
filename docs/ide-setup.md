# IDE Setup Guide

## Prerequisites

- Node.js 18+
- pnpm (`npm install -g pnpm`)
- The BRP repo cloned and installed:
  ```bash
  git clone https://github.com/BusiRocket/busirocket-agents-tools.git
  cd busirocket-agents-tools
  pnpm install
  pnpm rules:compile
  ```

---

## Claude Code

### As a Plugin (Recommended)

Load the project as a plugin using `--plugin-dir`:

```bash
claude --plugin-dir /path/to/busirocket-agents-tools
```

Skills are available as `/busirocket-agents-tools:<skill-name>`:

```
/busirocket-agents-tools:brp-plan
/busirocket-agents-tools:brp-fix
/busirocket-agents-tools:brp-review
```

### As Global Rules

Link the generated `CLAUDE.md` to your Claude Code config:

```bash
pnpm rules:link:claude
```

This symlinks `CLAUDE.md` and `.claude/rules/` to your home directory.

---

## Cursor

### Project-Level (Recommended)

After running `pnpm rules:compile`, rules are placed in `.cursor/rules/` which Cursor reads
automatically when the project is open.

### Global-Level

Copy or symlink the `.cursor/rules/` directory to your global Cursor configuration, or use the
Cursor Marketplace when BRP is published there.

---

## Codex (OpenAI)

Link the `AGENTS.md` and Codex rules globally:

```bash
pnpm rules:link:codex
```

This creates symlinks at `~/.codex/AGENTS.md` and `~/.codex/rules/default.rules`.

Restart Codex to pick up the new rules.

---

## Antigravity (Gemini)

Link the `GEMINI.md` and Antigravity rules globally:

```bash
pnpm rules:link:antigravity
```

This creates symlinks for the Gemini agent configuration.

---

## Windsurf

Link the `WINDSURF.md` and Windsurf rules globally:

```bash
pnpm rules:link:windsurf
```

This creates symlinks for the Windsurf configuration.

---

## Skills Validation (Optional)

To validate skills using the AgentSkills specification:

```bash
# Install the validator (one-time)
python3 -m venv .venv-validate
.venv-validate/bin/pip install skills-ref

# Validate all skills
pnpm skills:validate
```

---

## Troubleshooting

### Rules not showing up

1. Ensure you ran `pnpm rules:compile` after any rule changes
2. Check that the link script created the symlink: `ls -la ~/.codex/AGENTS.md`
3. Restart the IDE after linking

### Skills not recognized

1. Ensure the skill has a valid `SKILL.md` with proper YAML frontmatter
2. Run `pnpm skills:validate` to check for formatting issues
3. For Claude Code plugins, ensure the plugin is loaded with `--plugin-dir`

### Compilation errors

1. Ensure all `.mdc` files in `rules/source/` have valid frontmatter
2. Run `pnpm rules:check` to see what is out of date
3. Check `scripts/lib/rules/parseMdc.mjs` for supported frontmatter fields
