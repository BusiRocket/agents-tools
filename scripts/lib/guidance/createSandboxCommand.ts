import { existsSync } from "node:fs"

export const createSandboxCommand = (options: {
  platform: NodeJS.Platform
  scratchDir: string
  command: string
  args: string[]
}): { executable: string; args: string[] } => {
  if (options.platform === "darwin") {
    const profile = `(version 1) (allow default) (deny file-write*) (allow file-write* (subpath "${options.scratchDir}"))`
    return {
      executable: "/usr/bin/sandbox-exec",
      args: ["-p", profile, options.command, ...options.args],
    }
  }
  if (options.platform === "linux") {
    if (!existsSync("/usr/bin/bwrap"))
      throw new Error("required Linux sandbox runtime bwrap is unavailable")
    return {
      executable: "/usr/bin/bwrap",
      args: [
        "--die-with-parent",
        "--ro-bind",
        "/",
        "/",
        "--bind",
        options.scratchDir,
        options.scratchDir,
        "--chdir",
        "/",
        options.command,
        ...options.args,
      ],
    }
  }
  throw new Error(`unsupported sandbox platform: ${options.platform}`)
}
