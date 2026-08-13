# TODO — agents-tools

> Consolidated from the accessible Claude, Codex, Cursor, and Antigravity project history plus the
> `~/p` meta backlog (routed 2026-08-13) and the archived `BusiRocket/agents-skills` backlog. Last
> reviewed: 2026-08-13. History coverage: Partial — Claude Code transcripts before 2026-07-19 no
> longer exist on disk (repo work starts 2026-02-27), and the 2026-07-19 audit scratchpad reports
> (`findings.md`, `findings30.md`) were reconstructed from Codex rollouts, not read from disk. Open
> items from `TODO-skills-audit.md` (append-only audit history) are tracked here; that file is no
> longer a backlog.
>
> States: `[ ]` pending · `[~]` partial or unverified · `[!]` blocked · `[x]` verified complete ·
> `[-]` obsolete or superseded. Closed work moves to `TODO_LOG.md`.

## Router and hooks

- [ ] The `invoice-ops` router lane fires a broken directive: `src/hooks/utils/route_prompt.py:57`
      says "Use the invoice-quarter-close skill" but that skill no longer exists anywhere on disk
      (built 2026-07-19 outside the repo, wiped before the `skills:link` guard landed in `aa2a972`).
      Rebuild the skill — it covered the single largest recurring workload (99–101 prompts in the
      audit corpus) — or silence the lane until it exists. Right now the lane actively misdirects.
- [ ] Build the `project-continuation` skill behind the existing `continuation` router lane (17+
      resumption prompts route there; no skill answers).
- [ ] Build `lovable-sync` and `stakeholder-recap` skills — router lanes exist, skills do not.
      Source: `TODO-skills-audit.md` pending list.
- [ ] Add session-level idempotency so the router cannot direct the same skill twice in one session.
      Source: `TODO-skills-audit.md`.
- [ ] Round 2 audit re-run with the revised metrics: directive adherence (the one that matters),
      router coverage (baseline 172/1053 = 16%) and hand-measured lane precision. Include the known
      frontend miss: a plain "check this header on mobile" trigger test (2026-07-19) fired no design
      skill. Baselines and metric definitions in `TODO-skills-audit.md`.

## Skills

- [ ] Demote the 7 competing BRP skills (`brp-plan`, `brp-implement`, `brp-test`, `brp-debug`,
      `brp-fix`, `brp-refactor`, `brp-review`) to references — decision recorded 2026-07-19,
      deliberately deferred twice (concurrent edits, then the 30-day pass softening the "never
      fires" claim). Do it in one quiet pass with `hooks:test` and `skills:validate` as the net. All
      7 dirs still present under `src/skills/core/`.
- [ ] Resolve the runtime/catalog split — the Codex 30-day pass found 7 fired skills that are not in
      the catalog.
- [ ] Consolidate overlapping workflow skills: make superpowers `brainstorming`/`writing-plans`
      delegate to `brp-plan` and `systematic-debugging` to `brp-debug`/`brp-fix`; unify review entry
      points. `brainstorming`'s "MUST use before any creative work" wording still monopolises the
      trigger surface (58/80 skill loads in the 7-day corpus).
- [ ] Delete the dead activation-fixture layer: `src/skills/activation-smoke.json`,
      `src/skills/activation-acceptance.json`, `scripts/constants/SMOKE_PATH.ts`,
      `scripts/constants/ACCEPTANCE_PATH.ts` — no consumers (verified 2026-08-13), superseded by
      `ROUTER_TEST.ts` against verbatim transcript prompts.
- [ ] Improve the `job-search` skill's trigger phrases — accepted alternative to the rejected
      deterministic router lane (Codex 30-day pass); never verified as done.
- [ ] Candidate skills from the Codex 30-day pass, unbuilt: `communications-work-intake` (13
      sessions; Slack/Discord/WhatsApp/email intake, wider than `stakeholder-recap`) and
      `document-intake-reconciler` (Downloads/PDF/OCR triage into Holded).
- [ ] Pilot skill-creator-style blind A/B evals on one BRP skill (with-skill vs without-skill,
      isolated contexts); if pass rates match, the skill adds nothing. Also pressure-test skill
      wording adversarially (Superpowers method). Source:
      `~/p/brain/topics/claude-skills-ecosystem.md`.
- [ ] Diff `mattpocock/skills` (grill-with-docs, tdd, diagnose, improve-codebase-architecture)
      against the BRP equivalents for missing moves — e.g. ADR bar, diagnose state machine.
- [ ] Optional: restructure the 16 skill descriptions so the "Trigger when…" clause lands before
      ~char 150 (truncation risk flagged 2026-08-13, consciously left as an open offer).
- [!] Dead external-validator subsystem: `.venv-validate/bin/agentskills` shebang still points at
  the old `busirocket-agents` repo path, so `detectValidator`/`runValidate` can never work. Blocked
  on a decision: rebuild via `pnpm run validate:install` or delete the subsystem (gitignored dir —
  deletion needs explicit sign-off).

## Rules

- [ ] Staffbase rule auto-load gotcha: repos without `widget/`/`configuration/` markers (cli,
      darkmode, drawer, smart-search, global-content, search-widget, `example-*`/`test-*`) no longer
      load the rule; invoke `@staffbase` manually there or add `**/src/**` to its glob in
      `src/rules/integrations/staffbase.mdc`.
- [ ] Add the Context subscription-granularity reason (45ms/100 components vs 2ms/3 subscribers) to
      `src/rules/react/state-management.mdc` — verified 2026-08-13 the rule states the practice
      without the reason. Source: `~/p/brain/topics/react-modern.md`.

## Supply chain and secrets

- [ ] Install `detect-secrets` as a pre-commit hook and enable GitHub secret scanning on the active
      repos. A leaked AWS key was used 11 minutes after the push in one documented case. Cheap,
      one-time. Source: `~/p/brain/topics/app-security.md`.
- [ ] Add a variation-selector grep to CI or a pre-commit hook for the published repos —
      `grep -rP '[\x{FE00}-\x{FE0F}\x{E0100}-\x{E01EF}]'` — GlassWorm hid payloads in zero-width
      Unicode that no diff shows. Nearly free. Source: `~/p/brain/topics/supply-chain-security.md`.
- [ ] Audit CI for long-lived registry publish tokens readable by third-party actions (the LiteLLM
      vector was a compromised Trivy action stealing `PYPI_PUBLISH`); prefer OIDC/Trusted
      Publishers. Source: `~/p/brain/topics/supply-chain-security.md`.
- [ ] Adopt pnpm 11 supply-chain controls across `~/p` repos: `minimumReleaseAge: 1440` (24h
      cooldown defeats the compromised-token window) and `blockExoticSubdeps: true`. Needs Node 22
      and pnpm 11; check per repo. Source: `~/p/brain/topics/supply-chain-security.md`.
- [ ] Add `uv export --format requirements.txt` to any CI that adopts `uv`, as the exit ramp now
      that OpenAI owns it — one line, converts lock-in into a preference. Source:
      `~/p/brain/topics/supply-chain-security.md`.
- [ ] Run `npm pack --dry-run` before publishing any package from `~/p`: a source map with
      `sourcesContent` ships your source (that is how Claude Code's 512k-line codebase leaked).
      Source: `~/p/brain/topics/claude-code-practice.md`.

## Global agent config

This repo owns the global linking surface (`~/.agents`, `hooks:link`, `skills:link`), so losses in
that surface land here.

- [ ] Restore or rebuild the globally-installed `brain` and `invoice-quarter-close` skills — both
      missing before the 2026-08-13 restore, likely wiped by the pre-`aa2a972` link bug, and neither
      is in `~/.agents/.skill-lock.json`. Smallest action: locate their source (brain skill probably
      belongs to `~/p/brain` tooling; invoice-quarter-close see Router entry) or rebuild.
- [!] 6 `ckm-*` skills (banner-design, brand, design, design-system, slides, ui-styling) missing and
  never lock-tracked; installer unknown. Blocked: user must identify the source repo before any
  reinstall.
- [ ] Rewrite `~/.claude/claude-security-guidance.md` — built 2026-07-19 from 88 real ReviewHog
      findings (auth-present-but-not-authorized, fail-open error paths, SSRF, tenant scoping, Tauri
      boundaries), verified loaded at session end, now absent from disk. Investigate why it
      vanished, then regenerate; the security-review plugin's extension point reads it.

## Harness

- [ ] Dependency sweep for native replacements across the `~/p` frontends: `Intl.*` for formatting,
      `crypto.randomUUID`, `structuredClone`, `URLSearchParams`, `AbortController`. Measured
      elsewhere: audit vulnerabilities 17 -> 5. Fewer deps also shrinks the supply-chain surface.
      Source: `~/p/brain/topics/web-platform.md`.
- [ ] Measure the `security-review` auto fan-out cost vs value — it generated 627 machine sessions
      in one audited week (all 15 reviews of the 2026-07-19 diff set came back clean). Open question
      from audit Round 1.

## Cross-project

- [ ] `~/p/RocketUpdater` (no TODO.md there yet): commit or discard its untracked `.serena/` state —
      already named in `~/p/osseus/TODO.md`'s `.serena` entry, which can carry it; smallest action
      is closing it from the Osseus entry when either repo is next touched.
