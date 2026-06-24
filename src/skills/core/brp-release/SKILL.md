---
name: brp-release
description:
  Cut a versioned release from trunk by collecting commits since the last tag, choosing the semver
  bump, updating version and changelog, gating on a green check, and tagging. Trigger when the task
  is to ship a release, bump a version, or generate release notes/changelog for a repo. Do not use
  for writing the feature itself, debugging, or general code review unrelated to shipping.
allowed-tools: Read, Grep, Glob, Edit, Write, Bash
---

## Rules

- Never tag a release while lint, build, or tests are failing. The green check gates the tag.
- Derive the changelog from real commits since the last tag. Do not invent or pad entries.
- Pick the semver bump from the actual change scope: breaking -> major, feature -> minor, fix only
  -> patch.
- One immutable tag per release. Never move, delete, or reuse an existing tag.

## Workflow

1. Find the last release tag and collect the commits made since it.
2. Classify the changes (breaking, feature, fix) and choose the semver bump.
3. Update the version field(s) and changelog from those commits.
4. Run the full check (lint, build, tests). Stop and report if anything fails.
5. Tag the release and report version, changelog, and what was published.

## Output

- Return: version bump and reasoning, changelog entry, tag name, check result, anything skipped.
