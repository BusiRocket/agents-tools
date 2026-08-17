import { join } from "node:path"
import type { ResolveInstanceDirOptions } from "./types/ResolveInstanceDirOptions"

export const resolveInstanceDir = ({ flag, env, home }: ResolveInstanceDirOptions) => {
  if (flag) {
    return flag
  }

  const fromEnv = env.AGENTS_MACHINE_DIR
  if (fromEnv) {
    return fromEnv
  }

  return join(home, "p", "dotfiles", "machine")
}
