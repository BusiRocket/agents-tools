import os from "node:os"
import path from "node:path"
import { findIde } from "./ideRegistry.mjs"

const HOME = os.homedir()
const ROOT = process.cwd()

/**
 * Rule link configurations per IDE.
 *
 * Each entry has:
 *   - ide: reference from IDE_REGISTRY
 *   - cleanup: optional { dir, prefix } to clean before linking
 *   - links: array of { source, target, method: "symlink"|"copy" }
 */
export const IDE_RULE_TARGETS = [
  {
    ide: findIde("cursor"),
    cleanup: { dir: path.join(HOME, ".cursor", "rules"), prefix: "busirocket-" },
    links: [
      {
        source: path.join(ROOT, "dist", "global", ".cursor", "rules"),
        target: path.join(HOME, ".cursor", "rules", "busirocket"),
        method: "symlink",
      },
    ],
  },
  {
    ide: findIde("claude"),
    links: [
      {
        source: path.join(ROOT, "dist", "markdown", "CLAUDE.md"),
        target: path.join(HOME, ".claude", "CLAUDE.md"),
        method: "symlink",
      },
      {
        source: path.join(ROOT, "dist", "global", ".claude", "rules"),
        target: path.join(HOME, ".claude", "rules", "busirocket"),
        method: "symlink",
      },
    ],
  },
  {
    ide: findIde("codex"),
    links: [
      {
        source: path.join(ROOT, "dist", "markdown", "AGENTS.md"),
        target: path.join(HOME, ".codex", "AGENTS.md"),
        method: "symlink",
      },
      {
        source: path.join(ROOT, "dist", "global", "codex", "rules", "default.rules"),
        target: path.join(HOME, ".codex", "rules", "default.rules"),
        method: "symlink",
      },
    ],
  },
  {
    ide: findIde("antigravity"),
    links: [
      {
        source: path.join(ROOT, "dist", "markdown", "GEMINI.md"),
        target: path.join(HOME, ".gemini", "GEMINI.md"),
        method: "copy",
      },
    ],
  },
  {
    ide: findIde("windsurf"),
    links: [
      {
        source: path.join(ROOT, "dist", "markdown", "WINDSURF.md"),
        target: path.join(HOME, ".windsurf", "rules", "global.md"),
        method: "copy",
      },
    ],
  },
]
