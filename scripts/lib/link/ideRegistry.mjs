import os from "node:os"
import path from "node:path"

const HOME = os.homedir()

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
 * - skillsDir: where skills go (null for IDEs that only support rules)
 */
export const IDE_REGISTRY = [
  {
    id: "cursor",
    rootDir: path.join(HOME, ".cursor"),
    skillsDir: path.join(HOME, ".cursor", "skills"),
  },
  {
    id: "claude",
    rootDir: path.join(HOME, ".claude"),
    skillsDir: path.join(HOME, ".claude", "skills"),
  },
  {
    id: "codex",
    rootDir: path.join(HOME, ".codex"),
    skillsDir: null,
  },
  {
    id: "continue",
    rootDir: path.join(HOME, ".continue"),
    skillsDir: path.join(HOME, ".continue", "skills"),
  },
  {
    id: "cline",
    rootDir: path.join(HOME, ".cline"),
    skillsDir: path.join(HOME, ".cline", "skills"),
  },
  {
    id: "windsurf",
    rootDir: path.join(HOME, ".codeium"),
    skillsDir: path.join(HOME, ".codeium", "windsurf", "skills"),
  },
  {
    id: "antigravity",
    rootDir: path.join(HOME, ".gemini"),
    skillsDir: null,
  },
  {
    id: "augment",
    rootDir: path.join(HOME, ".augment"),
    skillsDir: path.join(HOME, ".augment", "skills"),
  },
  {
    id: "goose",
    rootDir: path.join(HOME, ".config", "goose"),
    skillsDir: path.join(HOME, ".config", "goose", "skills"),
  },
  {
    id: "crush",
    rootDir: path.join(HOME, ".config", "crush"),
    skillsDir: path.join(HOME, ".config", "crush", "skills"),
  },
  {
    id: "kiro",
    rootDir: path.join(HOME, ".kiro"),
    skillsDir: path.join(HOME, ".kiro", "skills"),
  },
  {
    id: "openhands",
    rootDir: path.join(HOME, ".openhands"),
    skillsDir: path.join(HOME, ".openhands", "skills"),
  },
  {
    id: "zencoder",
    rootDir: path.join(HOME, ".zencoder"),
    skillsDir: path.join(HOME, ".zencoder", "skills"),
  },
  {
    id: "adal",
    rootDir: path.join(HOME, ".adal"),
    skillsDir: path.join(HOME, ".adal", "skills"),
  },
]

/**
 * Find an IDE entry by id.
 *
 * @param {string} id - IDE identifier
 * @returns {{ id: string, rootDir: string, skillsDir: string | null }}
 */
export const findIde = (id) => {
  const ide = IDE_REGISTRY.find((entry) => entry.id === id)
  if (!ide) {
    throw new Error(`Unknown IDE: ${id}`)
  }
  return ide
}
