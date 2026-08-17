import { join } from "node:path"

type ResolveInstanceDirOptions = {
  flag?: string
  env: NodeJS.ProcessEnv
  home: string
}

export const resolveInstanceDir = ({ flag, env, home }: ResolveInstanceDirOptions) => {
  if (flag) {
    return flag
  }

  const fromEnv = env["AGENTS_MACHINE_DIR"]
  if (fromEnv) {
    return fromEnv
  }

  return join(home, "p", "dotfiles", "machine")
}
