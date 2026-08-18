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

## Machine MCP Configuration

The default machine instance is the tracked `machine/` directory in this repository. Check its
desired MCP state against Claude personal, Claude Favish, Codex, Gemini, and Cursor, together with
shared security policy and managed capability links, without writing files:

```bash
pnpm run machine:diff -- --json
```

For an alternate instance, pass `--instance /absolute/path` or set `AGENTS_MACHINE_DIR`. Secret
values stay in the environment; tracked manifests use `from_env` references.

After inspecting every planned path, apply all managed domains and require a converged second diff:

```bash
pnpm run machine:apply -- --json
pnpm run machine:diff -- --json
```

Every apply snapshots files, directories, and symbolic links first. Restore the newest snapshot with
`pnpm run machine:rollback -- --json`, or select one with `--to <run-id>`.

## Cross-Platform Health Check

Run the read-only doctor after setup or when an agent reports missing MCP servers, skills, rules,
hooks, or plugins:

```bash
pnpm run agents:doctor
pnpm --silent run agents:doctor -- --json > /tmp/agents-doctor.json
node -e 'JSON.parse(require("node:fs").readFileSync("/tmp/agents-doctor.json", "utf8"))'
```

Lifecycle meanings:

- `active`: a client command or desktop application is installed.
- `provisioned`: managed configuration exists, but no runtime is detected.
- `unavailable`: neither a runtime nor managed configuration is present.

Capability status `unsupported` means the client is present but exposes no compatible integration
for that capability. It is intentionally distinct from a missing client and is never emulated with
an undocumented path.

An unavailable optional client is informational. A required capability failure on an active or
provisioned client exits with status 1, while a malformed `machine/platforms.json` exits with
status 2. Reports replace the home directory and credential-shaped values before serialization.

## External Connector Health

`machine/connectors.json` declares profile scope, ownership, probe kind, and criticality without
credentials. Inspect it through the profile-aware doctor:

```bash
pnpm run connectors:doctor -- --json
```

Context7, Serena, and CodeGraph are required machine-managed MCP servers. Cloudflare is required in
both Claude profiles, OpenSEO is required only in the personal profile, and ZeroHedge is an optional
hosted connector. Consequently:

- a missing required connector, required OAuth flow, or required disabled connector exits with 1;
- an optional HTTP 503 remains visible as degraded and includes its responding boundary;
- reports never serialize response bodies, request headers, tokens, cookies, or account IDs.

Use `docs/runbooks/claude-connector-authentication.md` for profile-safe OAuth and
`docs/runbooks/zerohedge-connector.md` for the direct boundary probe. `agents:doctor` reuses the
same profile inspection instead of launching a duplicate Claude MCP inventory.

---

## Claude Code

The tracked security policy keeps the personal and Favish profiles as separate identity roots while
sharing only non-identity settings. Claude's `auto` permission mode remains the low-friction normal
mode. The dangerous-mode warning is enabled; restoring that warning does not add prompts to ordinary
`auto`-mode operations. Remote control at startup remains an explicit, documented exception for the
established remote terminal workflow.

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

Link the generated Claude rules to your Claude Code config:

```bash
pnpm rules:link
```

This symlinks `.claude/rules/` to your home directory. The lean global `~/.claude/CLAUDE.md` remains
hand-maintained.

---

## Cursor

### Project-Level (Recommended)

After running `pnpm rules:compile`, rules are placed in `.cursor/rules/` which Cursor reads
automatically when the project is open.

### Global-Level

Run `pnpm rules:link`; the managed rules are linked at `~/.cursor/rules/busirocket`. Cursor reads
skills directly from `~/.agents/skills`, so no `~/.cursor/skills` duplicate is created. Machine MCP
configuration is stored in `~/.cursor/mcp.json` and verified with:

```bash
cursor-agent mcp list
cursor-agent mcp list-tools codegraph
cursor-agent mcp list-tools context7
cursor-agent mcp list-tools serena
```

---

## Codex (OpenAI)

### Global Guidance

```bash
pnpm rules:link
```

This copies Codex `default.rules` into your Codex config. The global `~/.codex/AGENTS.md` remains
hand-maintained; `default.rules` is Codex exec-policy Starlark and must not contain Markdown prose.
In this project, `AGENTS.md` is not the primary delivery mechanism for reusable BRP workflows;
global skills are.

### Existing Claude Code Projects

To make Codex load repositories that have `CLAUDE.md` but no `AGENTS.md`, add this at the top level
of `~/.codex/config.toml` and restart Codex:

```toml
project_doc_fallback_filenames = ["CLAUDE.md"]
project_doc_max_bytes = 65536
```

Instruction discovery checks `AGENTS.override.md`, then `AGENTS.md`, then the configured fallback
names in each directory. When both `AGENTS.md` and `CLAUDE.md` exist together, `AGENTS.md` wins;
prefer a one-line `CLAUDE.md` shim pointing to `AGENTS.md` for new cross-agent repositories.

### Global Hooks

```bash
pnpm hooks:link
```

This refreshes the stable hook scripts under `~/.agents/hooks`. Register the desired commands in
`~/.codex/hooks.json`, then review and trust them with `/hooks` in Codex. The BRP SessionStart
reminder, UserPromptSubmit router, and Stop verification gate use hook payloads supported by both
Claude Code and Codex.

### Global Skills (Primary for BRP)

```bash
pnpm skills:link
```

`pnpm skills:link` uses a dual-layer product model:

- compiled skills are staged into the product-managed canonical directory `~/.agents/skills`
- the linker then distributes those compiled skills to each detected IDE target
- Codex reads `~/.agents/skills` directly and must not receive a duplicate copy in `~/.codex/skills`

Important:

- `~/.agents/skills` is this product's canonical internal directory for global skills
- IDE-specific destinations are linker-managed distribution targets
- unless separately verified, do not treat any IDE target path as an OpenAI-documented native path

For Codex specifically, this means the project treats the canonical user skills directory as the
primary BRP surface and keeps `~/.codex/AGENTS.md` as minimal policy/routing guidance.

The same command compiles the canonical Markdown definitions under `src/agents/` into Codex custom
agent TOML and links them into `~/.codex/agents`. Use `/agent` to inspect spawned threads; the
`brp-reviewer` role is available for isolated findings-first review.

### What To Validate In Codex

After linking, verify three separate behaviors:

1. discovery: the skill is visible or available to Codex
2. activation: the skill is selected for representative prompts
3. execution quality: the skill produces better behavior than the no-skill baseline

Restart Codex after linking if changes are not picked up immediately.

### State Recovery and Session Retention

Inspect Codex state without modifying it:

```bash
pnpm run codex:doctor -- --json
pnpm run codex:repair
pnpm run codex:archive -- --retention-days 90
```

The 2026-08-18 baseline found one corrupt derived database (`memories_1.sqlite`), two malformed
rollouts, and 4,059 active session files totaling 1,379,019,627 bytes. The 90-day archive plan
selected 236 sessions totaling 486,568,388 bytes. Apply commands refuse to run while a Codex process
or thread-writer lock is active.

After closing every Codex client, apply the reversible operations:

```bash
pnpm run codex:repair -- --apply
pnpm run codex:archive -- --retention-days 90 --apply
```

Each applied command prints its checksummed run directory and exact `pnpm run codex:restore`
command. Restore is a dry-run unless `--apply` is present and refuses destination collisions. Active
sessions remain under `~/.codex/sessions`; archived sessions live outside that tree under
`~/.codex/session-archive/<run-id>/`. Add repeatable `--sessions <path>` flags to
`library:observe-codex` when archived history should be included explicitly.

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

This copies the portable BRP bundle into Antigravity's configured skills directory
`~/.gemini/config/skills`.

Antigravity workspace skills live under `<workspace-root>/.agents/skills`. Gemini CLI discovers the
canonical global directory `~/.agents/skills` directly, so no duplicate Gemini CLI skill root is
populated. Both use native MCP configuration in `~/.gemini/settings.json`.

`pnpm skills:link` also distributes compiled skills into detected clients that require private
locations. Cursor, Codex, Gemini CLI, Windsurf, and TRAE instead discover the canonical directory.

---

## Windsurf

Install the concise global Windsurf policy:

```bash
pnpm rules:link
```

This copies the policy to Windsurf's documented global rule file at
`~/.codeium/windsurf/memories/global_rules.md`. It stays below the vendor's 6,000-character global
limit. Windsurf discovers skills directly from `~/.agents/skills`, so no duplicate global skill tree
is created.

---

## TRAE

TRAE discovers Agent Skills directly from `~/.agents/skills`. Run `pnpm skills:link` to refresh the
canonical library; the linker intentionally does not create `~/.trae/skills`.

---

## Skills Validation (Optional)

### Raw, Claude-native, and portable views

`~/.agents/skills` is the provenance-preserving source library. Claude consumes its native skill
format, including Claude-only frontmatter. Strict clients are checked against compiled views under
`~/.agents/compiled/<target>/skills`, where client-only fields are removed and logical names such as
`superpowers:systematic-debugging` receive safe aliases such as `superpowers-systematic-debugging`.

Do not link both the canonical and compiled view into a client that already discovers
`~/.agents/skills`; duplicate discovery creates precedence warnings. Run these non-mutating checks
before changing runtime links:

```bash
pnpm run skills:portability -- --library ~/.agents --json
pnpm run library:link -- --target codex --dry-run --json
pnpm run library:router-audit -- --dry-run --json
```

The 2026-08-18 inventory found 38 readable skills in each shared Claude profile and 102 readable
canonical skills for Codex, Cursor, Gemini CLI, Windsurf, and TRAE, with zero broken links on the
managed surfaces. A missing optional executable warning from a client is reported separately and is
not counted as a skill import failure.

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
2. Check the hand-maintained guidance and linked exec policy:
   `ls -la ~/.codex/AGENTS.md ~/.codex/rules/default.rules`
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
