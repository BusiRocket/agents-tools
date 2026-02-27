# 🚀 BusiRocket Rules

**Multi-IDE AI rules for maintainable, agent-friendly codebases** — Next.js, React, TypeScript, API boundaries, and optional Rust/Tauri.

A reusable set of AI agent rules compatible with **Cursor**, **Claude Code**, **Antigravity (Google Gemini)**, **Windsurf**, and **Codex**. Rules are kept under ~500 lines, split by concern, and reference each other instead of duplicating content. Optimised for **many small, focused files** and **thin route handlers** so both humans and AI agents can navigate and change the codebase safely.

---

## Why use this?

- **Consistent structure** — One exported symbol per file, types in `types/`, helpers in `utils/`, boundaries in `services/`.
- **Thin API layer** — Route handlers only validate input, call a service, and return a response.
- **Quality gate** — Rules remind you to run the project check script after meaningful changes.
- **Agent-friendly** — Small files and explicit boundaries improve context and reduce refactor risk when using Cursor (or similar) AI assistance.
- **Optional stacks** — Core + frontend + API rules are always relevant; Rust/Tauri and Supabase rules apply only when you use those stacks.

---

## Supported IDEs & Tools

This repository generates rules for all major AI-powered development tools:

- **[Cursor](https://cursor.com)** — `.cursor/rules/`
- **[Claude Code](https://claude.ai/code)** — `CLAUDE.md` and `.claude/rules/*.md`
- **[Antigravity (Google Gemini)](https://antigravity.google/)** — `GEMINI.md` and `.agent/rules/` + `.agent/workflows/`
- **[Windsurf](https://windsurf.ai)** — `WINDSURF.md` and `.windsurf/rules/`
- **[Codex](https://codex.ai)** — `AGENTS.md`

All rules are compiled from a single source (`rules/*.mdc`) to maintain consistency across tools.

---

## Global setup (symlink)

Rules now live in `rules/` and are compiled into tool-specific outputs.

To use with Cursor globally, compile first and symlink generated `.cursor/rules`:

```bash
git clone https://github.com/BusiRocket/ai-rules.git
cd ai-rules
pnpm rules:compile
ln -s "$(pwd)/.cursor/rules" ~/.cursor/rules
```

If you cloned into a different directory, use that path as the source:

```bash
ln -s /path/to/ai-rules/.cursor/rules ~/.cursor/rules
```

Cursor will then load these rules globally. To use rules per project instead, see [Quick start](#quick-start) below.

### Codex global setup

To use the generated `AGENTS.md` globally in Codex:

```bash
pnpm rules:compile
pnpm rules:link:codex
```

This links:

- `~/.codex/AGENTS.md` -> `<repo>/AGENTS.md`
- `~/.codex/rules/default.rules` -> `<repo>/codex/rules/default.rules`

Then restart Codex.

`~/.codex/rules/default.rules` is an empty template by default.
If you add your own `prefix_rule(...)` entries, validate them with:

```bash
codex execpolicy check --pretty \
  --rules ~/.codex/rules/default.rules \
  -- gh pr view 7888 --json title,body,comments
```

If you want to create links manually:

```bash
mkdir -p ~/.codex/rules
ln -s "$(pwd)/AGENTS.md" ~/.codex/AGENTS.md
ln -s "$(pwd)/codex/rules/default.rules" ~/.codex/rules/default.rules
```

### Claude global setup

To use generated Claude memory globally:

```bash
pnpm rules:compile
pnpm rules:link:claude
```

This links:

- `~/.claude/CLAUDE.md` -> `<repo>/CLAUDE.md`
- `~/.claude/rules/busirocket` -> `<repo>/.claude/rules`

Then restart Claude Code.

### Antigravity (Google Gemini) global setup

To use generated rules with Antigravity:

```bash
pnpm rules:compile
pnpm rules:link:antigravity
```

This copies:

- `~/.gemini/GEMINI.md` <- `<repo>/GEMINI.md`

Antigravity rules and workflows are automatically generated:

- `.agent/rules/` — individual rules (max 12,000 chars each)
- `.agent/workflows/` — sequential workflows for complex tasks

### Windsurf global setup

To use generated rules with Windsurf:

```bash
pnpm rules:compile
pnpm rules:link:windsurf
```

This copies:

- `~/.windsurf/rules/global.md` <- `<repo>/WINDSURF.md`

Windsurf-specific rules are generated in `.windsurf/rules/` with Cascade priorities.

### Link all IDEs at once

To set up all supported IDEs in one command:

```bash
pnpm rules:compile
pnpm rules:link:all
```

This links/copies rules for Cursor, Claude, Codex, Antigravity, and Windsurf.

---

## Quick start

1. **Edit source rules** in `rules/`.
2. **Compile outputs**:

   ```bash
   pnpm rules:compile
   ```

   This generates:
   - `.cursor/rules/**` — Cursor rules
   - `CLAUDE.md` + `.claude/rules/**/*.md` — Claude Code rules
   - `GEMINI.md` + `.agent/rules/**/*.md` + `.agent/workflows/**/*.md` — Antigravity rules & workflows
   - `WINDSURF.md` + `.windsurf/rules/**/*.md` — Windsurf rules
   - `AGENTS.md` — Codex bundle

3. **Optional — validate generated outputs**:

   ```bash
   pnpm rules:check
   ```

4. **Use umbrella rules in Cursor** when you want one rule that pulls in several:
   - **@core** — project, general, boundaries, naming, anti-patterns
   - **@react** — React architecture, hooks, state, accessibility, forms, performance, security
   - **@nextjs** — App Router architecture, route handlers, data fetching, server actions, performance, error handling
   - **@frontend** — Next.js, React, components, hooks, state, Tailwind, Vite runtime (when using Vite)
   - **@tailwind** — Tailwind v4 standards (baseline, tokens, class authoring, states, responsive, hygiene)
   - **@typescript** — TS standards, types, refactoring, post-change checks
   - **@javascript** — JS/TS domain rules (web apps, MV3 extensions, RN/Expo, Playwright, Shopify theme)
   - **@api** — route handlers, response shapes, validation, services vs utils
   - **@php** — general PHP + Laravel + WordPress + Drupal standards
   - **@refactor** — @file refactor + TypeScript refactoring
   - **@rust** — Rust + Tauri (when used)
   - **@bash** — Bash/Shell standards and @file refactor for `.sh` files
   - **@python** — Python schema-driven development and UV
   - **@n8n** — n8n workflow design and MCP tools
   - **@deploy** — K8s Helm deploy and agent (Sonnet) guidelines

---

## Folder layout

| Folder/File         | Purpose                                          |
| ------------------- | ------------------------------------------------ |
| `rules/`            | Source of truth for all `.mdc` rules             |
| `.cursor/rules/`    | Generated rules for Cursor                       |
| `CLAUDE.md`         | Generated bundle for Claude Code                 |
| `.claude/rules/`    | Generated modular rules for Claude Code          |
| `GEMINI.md`         | Generated bundle for Antigravity (Google Gemini) |
| `.agent/rules/`     | Generated rules for Antigravity                  |
| `.agent/workflows/` | Generated workflows for Antigravity              |
| `WINDSURF.md`       | Generated bundle for Windsurf                    |
| `.windsurf/rules/`  | Generated rules for Windsurf                     |
| `AGENTS.md`         | Generated bundle for Codex                       |
| `codex/rules/`      | Source-controlled Codex `.rules` files           |

---

## References inside rules

Rules reference other rules by path (e.g. `.cursor/rules/nextjs/route-handlers.mdc`). Keep references target-compatible and avoid duplicating content.

---

## Customization

- **Rename or remove domains** — Delete or rename folders under `rules/` and update umbrella files (`core.mdc`, `frontend.mdc`, `api.mdc`, etc.) that point at them.
- **Add your own rules** — Add new `.mdc` files under `rules/` (and optionally new umbrella entries).
- **Adjust strictness** — Edit the rule files to loosen or tighten constraints (e.g. file length, export count) to match your team.

---

## Scripts (from this repo)

When working inside this repository:

| Script                        | Description                                   |
| ----------------------------- | --------------------------------------------- |
| `pnpm rules:compile`          | Compile rules for all IDEs                    |
| `pnpm rules:check`            | Validate generated outputs are current        |
| `pnpm rules:link:codex`       | Create/update global Codex symlinks           |
| `pnpm rules:link:claude`      | Create/update global Claude symlinks          |
| `pnpm rules:link:antigravity` | Copy GEMINI.md to global Antigravity location |
| `pnpm rules:link:windsurf`    | Copy WINDSURF.md to global Windsurf location  |
| `pnpm rules:link:all`         | Link/copy rules for all supported IDEs        |
| `pnpm format`                 | Format all `.mdc` rules with Prettier         |
| `pnpm format:check`           | Check that rules are formatted (CI)           |

---

## Codex coverage checklist

Current status against Codex docs:

- `AGENTS.md` support: **enabled** (generated from `rules/**/*.mdc`).
- `CLAUDE.md` support: **enabled** (generated from `rules/**/*.mdc`).
- `.claude/rules/*.md` support: **enabled** (generated from `rules/**/*.mdc`, with `globs` mapped to `paths`).
- `Rules` (`.rules` / `prefix_rule`) support: **template ready** (`codex/rules/default.rules` + global symlink helper).
- `codex execpolicy check` test flow: **documented** for your own rules.
- Inline rule tests (`match` / `not_match`): **available** when you define your own rules.

Not yet automated:

- No compile step from `.mdc` to `.rules` (they are different languages and should stay separate).
- No CI check yet for `codex execpolicy check` (can be added if you want).

---

## Contributing

Contributions are welcome. Please open an issue or a pull request. Keep rules under ~500 lines per file, one concern per file, and use references to other rules instead of duplicating content.

---

## License

MIT — see [LICENSE](LICENSE) for details.
