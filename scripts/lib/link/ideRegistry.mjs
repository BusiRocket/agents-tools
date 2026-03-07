import os from "node:os"
import path from "node:path"
import { existsSync } from "node:fs"

const HOME = os.homedir()
const CONFIG_HOME = process.env.XDG_CONFIG_HOME?.trim() || path.join(HOME, ".config")
const CODEX_HOME = process.env.CODEX_HOME?.trim() || path.join(HOME, ".codex")
const CLAUDE_HOME = process.env.CLAUDE_CONFIG_DIR?.trim() || path.join(HOME, ".claude")

const getOpenClawRootDir = () => {
  const candidates = [
    path.join(HOME, ".openclaw"),
    path.join(HOME, ".clawdbot"),
    path.join(HOME, ".moltbot"),
  ]

  for (const candidate of candidates) {
    if (existsSync(candidate)) {
      return candidate
    }
  }

  return candidates[0]
}

const getOpenClawSkillsDir = () => path.join(getOpenClawRootDir(), "skills")

/**
 * Canonical skills directory — single source of truth for skills.
 * Project skills symlink here first, then fan out to IDE targets.
 */
export const CANONICAL_SKILLS_DIR = path.join(HOME, ".agents", "skills")

/**
 * Master registry of all supported IDEs/tools.
 *
 * - id: short identifier for logs
 * - rootDir: IDE root directory (used to detect if installed)
 * - detectPaths: optional alternative paths that count as installed
 * - skillsDir: where skills go (null for IDEs that only support rules)
 */
export const IDE_REGISTRY = [
  {
    id: "amp",
    rootDir: path.join(CONFIG_HOME, "amp"),
    skillsDir: path.join(CONFIG_HOME, "agents", "skills"),
    linkStrategy: "symlink",
  },
  {
    id: "cursor",
    rootDir: path.join(HOME, ".cursor"),
    skillsDir: path.join(HOME, ".cursor", "skills"),
    linkStrategy: "symlink",
  },
  {
    id: "claude",
    rootDir: CLAUDE_HOME,
    skillsDir: path.join(CLAUDE_HOME, "skills"),
    linkStrategy: "symlink",
  },
  {
    id: "codex",
    rootDir: CODEX_HOME,
    detectPaths: [CODEX_HOME, "/etc/codex"],
    skillsDir: path.join(CODEX_HOME, "skills"),
    linkStrategy: "symlink",
  },
  {
    id: "copilot",
    rootDir: path.join(HOME, ".copilot"),
    skillsDir: path.join(HOME, ".copilot", "skills"),
    linkStrategy: "symlink",
  },
  {
    id: "continue",
    rootDir: path.join(HOME, ".continue"),
    skillsDir: path.join(HOME, ".continue", "skills"),
    linkStrategy: "symlink",
  },
  {
    id: "cline",
    rootDir: path.join(HOME, ".cline"),
    skillsDir: path.join(HOME, ".cline", "skills"),
    linkStrategy: "symlink",
  },
  {
    id: "windsurf",
    rootDir: path.join(HOME, ".codeium"),
    skillsDir: path.join(HOME, ".codeium", "windsurf", "skills"),
    linkStrategy: "symlink",
  },
  {
    id: "antigravity",
    rootDir: path.join(HOME, ".gemini", "antigravity"),
    skillsDir: path.join(HOME, ".gemini", "antigravity", "skills"),
    linkStrategy: "copy",
  },
  {
    id: "augment",
    rootDir: path.join(HOME, ".augment"),
    skillsDir: path.join(HOME, ".augment", "skills"),
    linkStrategy: "symlink",
  },
  {
    id: "gemini-cli",
    rootDir: path.join(HOME, ".gemini"),
    skillsDir: path.join(HOME, ".gemini", "skills"),
    linkStrategy: "symlink",
  },
  {
    id: "goose",
    rootDir: path.join(CONFIG_HOME, "goose"),
    skillsDir: path.join(CONFIG_HOME, "goose", "skills"),
    linkStrategy: "symlink",
  },
  {
    id: "openclaw",
    rootDir: getOpenClawRootDir(),
    detectPaths: [
      path.join(HOME, ".openclaw"),
      path.join(HOME, ".clawdbot"),
      path.join(HOME, ".moltbot"),
    ],
    skillsDir: getOpenClawSkillsDir(),
    linkStrategy: "symlink",
  },
  {
    id: "opencode",
    rootDir: path.join(CONFIG_HOME, "opencode"),
    skillsDir: path.join(CONFIG_HOME, "opencode", "skills"),
    linkStrategy: "symlink",
  },
  {
    id: "roo",
    rootDir: path.join(HOME, ".roo"),
    skillsDir: path.join(HOME, ".roo", "skills"),
    linkStrategy: "symlink",
  },
  {
    id: "crush",
    rootDir: path.join(CONFIG_HOME, "crush"),
    skillsDir: path.join(CONFIG_HOME, "crush", "skills"),
    linkStrategy: "symlink",
  },
  {
    id: "kiro",
    rootDir: path.join(HOME, ".kiro"),
    skillsDir: path.join(HOME, ".kiro", "skills"),
    linkStrategy: "symlink",
  },
  {
    id: "junie",
    rootDir: path.join(HOME, ".junie"),
    skillsDir: path.join(HOME, ".junie", "skills"),
    linkStrategy: "symlink",
  },
  {
    id: "kilo",
    rootDir: path.join(HOME, ".kilocode"),
    skillsDir: path.join(HOME, ".kilocode", "skills"),
    linkStrategy: "symlink",
  },
  {
    id: "openhands",
    rootDir: path.join(HOME, ".openhands"),
    skillsDir: path.join(HOME, ".openhands", "skills"),
    linkStrategy: "symlink",
  },
  {
    id: "zencoder",
    rootDir: path.join(HOME, ".zencoder"),
    skillsDir: path.join(HOME, ".zencoder", "skills"),
    linkStrategy: "symlink",
  },
  {
    id: "adal",
    rootDir: path.join(HOME, ".adal"),
    skillsDir: path.join(HOME, ".adal", "skills"),
    linkStrategy: "symlink",
  },
  {
    id: "qoder",
    rootDir: path.join(HOME, ".qoder"),
    skillsDir: path.join(HOME, ".qoder", "skills"),
    linkStrategy: "symlink",
  },
  {
    id: "qwen-code",
    rootDir: path.join(HOME, ".qwen"),
    skillsDir: path.join(HOME, ".qwen", "skills"),
    linkStrategy: "symlink",
  },
  {
    id: "trae",
    rootDir: path.join(HOME, ".trae"),
    skillsDir: path.join(HOME, ".trae", "skills"),
    linkStrategy: "symlink",
  },
]

/**
 * Find an IDE entry by id.
 *
 * @param {string} id - IDE identifier
 * @returns {{ id: string, rootDir: string, detectPaths?: string[], skillsDir: string | null }}
 */
export const findIde = (id) => {
  const ide = IDE_REGISTRY.find((entry) => entry.id === id)
  if (!ide) {
    throw new Error(`Unknown IDE: ${id}`)
  }
  return ide
}
