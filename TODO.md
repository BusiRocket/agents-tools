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

- [ ] Round 2 audit re-run with the revised metrics: directive adherence (the one that matters),
      router coverage (baseline 172/1053 = 16%) and hand-measured lane precision. Include the known
      frontend miss: a plain "check this header on mobile" trigger test (2026-07-19) fired no design
      skill. Baselines and metric definitions in `TODO-skills-audit.md`.

## Skills

- [ ] Candidate skills from the Codex 30-day pass, unbuilt: `communications-work-intake` (13
      sessions; Slack/Discord/WhatsApp/email intake, wider than `stakeholder-recap`) and
      `document-intake-reconciler` (Downloads/PDF/OCR triage into Holded).
- [ ] Pilot skill-creator-style blind A/B evals on one BRP skill (with-skill vs without-skill,
      isolated contexts); if pass rates match, the skill adds nothing. Also pressure-test skill
      wording adversarially (Superpowers method). Source:
      `~/p/brain/topics/claude-skills-ecosystem.md`.
- [ ] Diff `mattpocock/skills` (grill-with-docs, tdd, diagnose, improve-codebase-architecture)
      against the BRP equivalents for missing moves — e.g. ADR bar, diagnose state machine.

## Supply chain and secrets

- [ ] Install `detect-secrets` as a pre-commit hook and enable GitHub secret scanning on the active
      repos. A leaked AWS key was used 11 minutes after the push in one documented case. Cheap,
      one-time. Source: `~/p/brain/topics/app-security.md`.
- [~] Add a variation-selector scan to CI for the published repos — GlassWorm hid payloads in
  zero-width Unicode that no diff shows. This repo covered 2026-08-13 (`hygiene:test` in
  `check:all`, scans all tracked files; `scripts/lib/isHiddenUnicode.ts` is reusable). Remaining:
  the other published repos. Source: `~/p/brain/topics/supply-chain-security.md`.
- [~] Audit CI for long-lived registry publish tokens readable by third-party actions (the LiteLLM
  vector was a compromised Trivy action stealing `PYPI_PUBLISH`); prefer OIDC/Trusted Publishers.
  This repo verified clean 2026-08-13: no `.github/workflows`, no CI at all. A keyword sweep of
  `~/p` flagged 16 repos whose workflows mention publish/token terms and need the real audit:
  baseline, dj-rocket, helm-cron, helm-drupal, helm-solr, Mains.World, mempalace, poirocket,
  staffbase-cli, staffbase-drawer, staffbase-shoutouts, staffbase-utils, thewealthadvisor,
  verticagtm, vexa-insight-dashboard, zerohedge-mcp. Source:
  `~/p/brain/topics/supply-chain-security.md`.
- [ ] Adopt pnpm 11 supply-chain controls across `~/p` repos: `minimumReleaseAge: 1440` (24h
      cooldown defeats the compromised-token window) and `blockExoticSubdeps: true`. Needs Node 22
      and pnpm 11; check per repo. Source: `~/p/brain/topics/supply-chain-security.md`.
- [ ] Add `uv export --format requirements.txt` to any CI that adopts `uv`, as the exit ramp now
      that OpenAI owns it — one line, converts lock-in into a preference. Source:
      `~/p/brain/topics/supply-chain-security.md`.
- [ ] Run `npm pack --dry-run` before publishing any package from `~/p`: a source map with
      `sourcesContent` ships your source (that is how Claude Code's 512k-line codebase leaked).
      Source: `~/p/brain/topics/claude-code-practice.md`.

## Harness

- [ ] Dependency sweep for native replacements across the `~/p` frontends: `Intl.*` for formatting,
      `crypto.randomUUID`, `structuredClone`, `URLSearchParams`, `AbortController`. Measured
      elsewhere: audit vulnerabilities 17 -> 5. Fewer deps also shrinks the supply-chain surface.
      Source: `~/p/brain/topics/web-platform.md`.
- [ ] Decide whether to keep the `security-review` auto fan-out: measured 2026-08-13 at ~$2,691/30d
      list-price equivalent (2,324 sessions, ~77/day, Opus 4.7) with a ~1.7% candidate-flag rate and
      no confirmed real finding in the sampled verdicts. Options: keep (subscription absorbs it),
      scope to risky paths only, or disable. Numbers in `TODO_LOG.md` 2026-08-13.

## Cross-project

- [ ] `~/p/RocketUpdater` (no TODO.md there yet): commit or discard its untracked `.serena/` state —
      already named in `~/p/osseus/TODO.md`'s `.serena` entry, which can carry it; smallest action
      is closing it from the Osseus entry when either repo is next touched.
