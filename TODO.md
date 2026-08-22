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
- [ ] Evaluate a conversation-only "grill" gate skill for business/marketing decisions (offer,
      positioning, pricing), modeled on Pocock's grill-me as used by practitioners on non-code
      ideas: questions in rounds (dependent questions wait), ~46 questions / 4 rounds as an ordinary
      session, ends when nothing is left to ask, and the pushback rule ("a session with no pushback
      is a session you didn't need"). Source: `~/p/brain/topics/claude-skills-ecosystem.md`
      (2026-08-19 section).
- [ ] Candidate BRP rule/hook: require a screen-recording video attached to any PR that changes UI
      state (steipete's one-line AGENTS.md rule at openclaw; GitHub accepts programmatic video
      upload — worked example openclaw/openclaw#124013). Fits next to the existing
      evidence-before-claims posture. Source: `~/p/brain/topics/claude-code-practice.md` (2026-08-19
      X sweep section).

## Skills library cleanup

> Decided 2026-08-17: curate one list and link it to every IDE including Antigravity, rather than
> the current split where Claude Code is offered 13 skills and the other 94 bundles reach only
> Codex. Nothing is deleted; unused bundles leave the default fan-out and stay in the repo.
> Measurements: `~/p/dotfiles/docs/machine-inventory/skills-triage.md`.

- [ ] Link the curated list into `~/.claude/skills` and into Antigravity (`~/.gemini/config/skills`,
      which currently carries only the 7 BRP skills). Claude Code sees 13 of 273 skills today and
      all 13 are BRP; the rest were never offered to it.
- [ ] Build `communications-work-intake`: Discord, Slack, WhatsApp and email intake to context plus
      drafted reply. 141 requests across four projects in 30 days; `stakeholder-recap` covers only
      the narrower recap shape and fired once. Largest measured gap.
- [ ] Build a screenshot-to-component skill for the real stack (shadcn/Radix/Tailwind, project
      tokens, existing components). 182 requests arrive as pasted screenshots; the seven design
      skills installed are all about taste or review and none does this job. Use `ckm-ui-styling` as
      source material, not as a competitor.
- [ ] Extend the business lane next to `invoice-quarter-close` (27 invocations, the most-used
      non-Superpowers skill): contracts review and modification (26 requests) and digital PDF
      signing (12) have no coverage.
- [ ] Build a background-job watch procedure: 44 requests asking for progress on long-running jobs,
      with no skill and only `/loop` as a harness feature.
- [ ] Delete the 16 Java/Spring-only bundles (14 `unit-test-*` plus `clean-architecture` and
      `docs-updater`). Body scan confirms no other tech signal, and no Spring codebase exists in
      `~/p`.
- [ ] Review skill by skill against the work actually done here, deciding for each what it does and
      whether it earns its place. This is the real cleanup: the library is an accumulation of
      experiments that were never triaged. Start with the six bundles holding ~170 SKILL.md files
      and one recorded call between them (`engineering-advanced-skills` 47, `marketing-skills` 45,
      `engineering-skills` 37, `product-skills` 17, `ra-qm-skills` 14, `pm-skills` 8), then the 21
      Java/Spring `unit-test-*` bundles, which match no codebase in `~/p`.
- [ ] Resolve the capabilities that exist on several surfaces at once: `frontend-design` is both an
      `~/.agents` bundle and an official plugin, both called 11 times; `context7` is a plugin, an
      MCP server and an always-on rule. Pick one surface each.
- [ ] Re-check `brp-rust-quality` and `lovable-sync` after another month. Both are linked and had
      zero calls in the 30-day window, but both are recent and narrow, so the window is too short to
      conclude anything.
- [ ] Re-run the classification for `pm-skills/SKILL.md` and `drizzle-orm-patterns/SKILL.md`, the
      two the mining pass dropped.

## Skill library and learning loop

> Shipped 2026-08-18: the four curation states, seeding from the lock, per-skill curation, linking
> what is adopted, the transcript observer, trigger learning with secret redaction, delegated
> classification, the router audit, proposals and automatic parking behind a grace period. Claude
> Code went from 13 skills offered to 30. Spec and plan:
> `docs/superpowers/specs/2026-08-18-skill-library-and-learning-loop-design.md`.

- [ ] Check the weekly loop reports (`~/.agents-learning/reports/`, LaunchAgent
      `com.cristian.library-loop`, Sundays 06:30; agent verified loaded 2026-08-22 via
      `launchctl list`, no report yet — first run is 2026-08-23) and whether the promoted skills
      fire. A promotion that does not change invocation counts is a proposal to demote, and that is
      the first real test of whether any of this works. First scheduled run will also do the first
      full classification pass (~26 agy batches), so expect it to take a while and check
      `~/.agents-learning/loop.log` if the report is missing.
- [ ] Exercise patch reapplication against a real fork. Implemented and tested for the conflict
      case, never run for real, because nothing is forked yet.
- [ ] Codex-side usage stays unmeasured. `library:observe-codex` refuses to report it: an anchored
      read pattern returns 912, 911 and 913 across unrelated skills, which is a catalogue listing,
      not use. Either Codex gains a real invocation signal or proposals stay Claude-scoped.
- [ ] Decide what to do with the 87 parked entries, now that parking is cheap and reversible. The 16
      Java/Spring bundles are the obvious first pass.

## Machine provisioning

> Scope decided 2026-08-17: this repo stays public and data-free and holds the engine (schemas,
> capture readers, per-target renderers, CLI). The manifests carrying real values stay in the
> private `BusiRocket/dotfiles` repo, which already owns brew, shell, symlinks, launchd and secrets.
> Measured inventories behind these items: `~/p/dotfiles/docs/machine-inventory/`.

- [!] Complete account-local authentication on `macmini`. Managed configuration is converged, but
  `agents:doctor` still reports Cursor MCP failed; Claude needs Cloudflare in personal and Favish
  plus OpenSEO in personal. ZeroHedge is optional and absent in both Claude profiles. Authentication
  requires the user's browser/account session and must not be copied from another machine. User
  decision 2026-08-22: will log in on the mini on demand, when those services are next needed there
  — not a scheduled task. Follow `docs/runbooks/claude-connector-authentication.md`, then verify
  with `pnpm run connectors:doctor -- --json` and `pnpm run agents:doctor -- --json` on the mini.
- [ ] Plugin manifest: marketplaces plus plugins pinned by version, and the enabled/disabled state,
      which is the part no current tooling records (18 enabled, 18 disabled today). Reinstalling all
      36 and leaving them on does not reproduce the machine.
- [ ] Plugin cache hygiene: 16 plugins keep stale older versions on disk (Figma 5, Amplitude, Sentry
      and Superpowers 4 each) inside a 2.7 GB cache. Decide whether the apply step prunes versions
      that no plugin resolves to.
- [ ] Services: render launchd plists and systemd units from one description. Every user-authored
      LaunchAgent except two hardcodes an absolute home path.
- [ ] Profiles: compose domains into named targets (`full` for a primary machine with both Claude
      profiles and the mempalace daemons, `lite` without daemons or the editable fork).
- [ ] Capture readers per domain, so the manifests can be regenerated from a live machine rather
      than hand-edited. Without them the manifests go stale in weeks, which is the failure mode the
      current rsync mirroring already shows.
- [ ] Record install provenance for the tools that have none: `agy`, `herdr`, `claude`, `codex`,
      `cursor-agent` exist only as opaque binaries or app-managed symlinks. `agy` is currently
      unrecoverable if the disk is lost.
- [ ] Pin how `codegraph` and Serena are installed. Both run daily as MCP servers but neither
      appears as a package in the runtime sweep, so no installer can claim completeness yet.
- [ ] `config` apply must merge, never replace: third-party tools (orca, atuin, warp) inject hooks
      into `settings.json` without asking, and a full rewrite drops them.
- [ ] `statusLine` in `settings.json` points at caveman `25d22f864ad6` while the installed version
      is `0d95a81d35a9`. Both directories exist so it works; it is a pin to a stale copy that a
      cache prune would break.
- [ ] `serena@claude-plugins-official` is installed but missing from `enabledPlugins`, so its state
      is defaulted rather than declared. Declare it.

## Supply chain and secrets

- [!] Rotate the still-live credentials recovered on 2026-08-17 from `~/.gemini/mcp_config.json` (2
  GitHub PATs, Context7, Bright Data, Firecrawl, Browser Use, n8n JWT, Brave Search; the two
  ZeroHedge MongoDB URIs only need revoking). Values and uses in
  `~/p/brain/business/misc-credentials.md`. State 2026-08-22: user explicitly deferred the rotation
  ("de momento no voy a rotar ninguna"); neo cleanup done (no `mcp_config.json` in `/root/.gemini`,
  and `p/brain`/`p/vault` copies deleted); remaining exposure surface is `portatil`'s legacy
  `~/.gemini` (machine unreachable 2026-08-22 — delete it when the laptop is next on the network)
  plus the providers themselves. Unblock action when resumed: the per-provider dashboard checklist
  from the 2026-08-22 session.
- [ ] Install `detect-secrets` as a pre-commit hook and enable GitHub secret scanning on the active
      repos. A leaked AWS key was used 11 minutes after the push in one documented case. Cheap,
      one-time. Source: `~/p/brain/topics/app-security.md`.
- [ ] `poirocket` was flagged in the 2026-08-13 publish-token keyword sweep but has no checkout
      under `~/p`, so the 2026-08-22 audit could not cover it (the other 15 flagged repos are done,
      see `TODO_LOG.md`). Clone or locate it and check its workflows for long-lived registry tokens.
- [ ] Adopt pnpm 11 supply-chain controls across `~/p` repos: `minimumReleaseAge: 1440` (24h
      cooldown defeats the compromised-token window) and `blockExoticSubdeps: true`. Needs Node 22
      and pnpm 11; check per repo. Source: `~/p/brain/topics/supply-chain-security.md`.
- [ ] Add `uv export --format requirements.txt` to any CI that adopts `uv`, as the exit ramp now
      that OpenAI owns it — one line, converts lock-in into a preference. Source:
      `~/p/brain/topics/supply-chain-security.md`.

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
