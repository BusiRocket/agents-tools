import { promises as fs } from "node:fs"
import path from "node:path"
import { cleanGlobalPrefix } from "./cleanGlobalPrefix"
import { ensureParentDirectory } from "./ensureParentDirectory"
import { linkOneWithBackup } from "./linkOneWithBackup"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const linkRuleTarget = async (ruleTarget: any) => {
  let cleaned: string[] = []

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  if (ruleTarget.cleanup) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    cleaned = await cleanGlobalPrefix(ruleTarget.cleanup.dir, ruleTarget.cleanup.prefix)
  }

  let linked = 0
  let copied = 0

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  for (const link of ruleTarget.links) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    await ensureParentDirectory(link.target)

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (link.method === "copy") {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      const sourceStat = await fs.lstat(link.source)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      await fs.mkdir(path.dirname(link.target), { recursive: true })

      if (sourceStat.isDirectory()) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
        await fs.rm(link.target, { recursive: true, force: true })
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
        await fs.cp(link.source, link.target, { recursive: true, dereference: true })
      } else {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
        const content = await fs.readFile(link.source, "utf8")
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
        await fs.writeFile(link.target, content, "utf8")
      }

      copied++
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      await linkOneWithBackup({ source: link.source, target: link.target })
      linked++
    }
  }

  return { cleaned, linked, copied }
}
