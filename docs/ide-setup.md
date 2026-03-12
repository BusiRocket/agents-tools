# IDE Setup Guide

## Prerequisites

- Node.js 18+
- pnpm (`npm install -g pnpm`)
- The BRP repo cloned and installed:
  ```bash
  git clone https://github.com/BusiRocket/busirocket-agents-tools.git
  cd busirocket-agents-tools
  pnpm install
  pnpm build
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

### Global Guidance

```bash
pnpm rules:link
```

This links the generated `AGENTS.md` into your Codex config as lightweight global guidance. In this
project, `AGENTS.md` is not the primary delivery mechanism for reusable BRP workflows; global skills
are.

### Global Skills (Primary for BRP)

```bash
pnpm skills:link
```

`pnpm skills:link` uses a dual-layer product model:

- compiled skills are staged into the product-managed canonical directory `~/.agents/skills`
- the linker then distributes those compiled skills to each detected IDE target
- Codex is treated as one of those product-managed IDE targets

Important:

- `~/.agents/skills` is this product's canonical internal directory for global skills
- IDE-specific destinations are linker-managed distribution targets
- unless separately verified, do not treat any IDE target path as an OpenAI-documented native path

For Codex specifically, this means the project treats skills as the primary BRP surface and keeps
`~/.codex/AGENTS.md` as minimal policy/routing guidance.

### What To Validate In Codex

After linking, verify three separate behaviors:

1. discovery: the skill is visible or available to Codex
2. activation: the skill is selected for representative prompts
3. execution quality: the skill produces better behavior than the no-skill baseline

Restart Codex after linking if changes are not picked up immediately.

---

## Antigravity (Gemini)

Link the `GEMINI.md` and Antigravity rules globally:

```bash
pnpm rules:link
```

This copies `GEMINI.md` to `~/.gemini/GEMINI.md` and syncs Antigravity rule/workflow files into
`~/.gemini/.agent/rules` and `~/.gemini/.agent/workflows`.

To install BRP skills for Antigravity as well:

```bash
pnpm skills:link
```

This copies compiled skills into Antigravity's global skills directory
`~/.gemini/antigravity/skills`.

Antigravity workspace skills live under `<workspace-root>/.agents/skills`. This is separate from
Gemini CLI's shared global skills directory at `~/.gemini/skills`, which `pnpm skills:link` also
populates when Gemini CLI is installed.

`pnpm skills:link` also distributes compiled skills into all detected supported IDE targets managed
by this product, including Cursor, Claude Code, Codex, Continue, Cline, Windsurf, Gemini CLI, Goose,
OpenHands, Augment, Roo, Kiro, Copilot, OpenCode, OpenClaw, Crush, Zencoder, AdaL, Trae, Qoder, and
Qwen Code.

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
3. Run `pnpm skills:test` to verify discovery and activation checks
4. For Claude Code plugins, ensure the plugin is loaded with `--plugin-dir`

### Compilation errors

1. Ensure all `.mdc` files in `rules/source/` have valid frontmatter
2. Run `pnpm rules:check` to see what is out of date
3. Check `scripts/lib/rules/parseMdc.mjs` for supported frontmatter fields
