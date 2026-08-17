import { promises as fs } from "node:fs"
import { homedir } from "node:os"
import { join } from "node:path"
import { flagValue } from "../lib/machine/cli/flagValue"
import { listAuthoredBundles } from "../lib/library/cli/listAuthoredBundles"
import { listSkillBundles } from "../lib/library/cli/listSkillBundles"
import { readSkillLock } from "../lib/library/cli/readSkillLock"
import { resolveLibraryDir } from "../lib/library/cli/resolveLibraryDir"
import { formatSeedReport } from "../lib/library/formatters/formatSeedReport"
import { seedManifestFromLock } from "../lib/library/seedManifestFromLock"

export const main = async () => {
  const asJson = process.argv.includes("--json")
  const dryRun = process.argv.includes("--dry-run")
  const flag = flagValue(process.argv, "--library")

  const libraryDir = resolveLibraryDir({
    ...(flag === undefined ? {} : { flag }),
    env: process.env,
    home: homedir(),
  })

  const lock = await readSkillLock(libraryDir)

  if (Object.keys(lock).length === 0) {
    console.error(`no .skill-lock.json under ${libraryDir}`)
    process.exitCode = 1
    return
  }

  const manifest = seedManifestFromLock(
    lock,
    await listAuthoredBundles(libraryDir),
    await listSkillBundles(libraryDir),
  )
  const target = join(libraryDir, "curation.json")

  if (!dryRun) {
    const exists = await fs
      .access(target)
      .then(() => true)
      .catch(() => false)

    if (exists && !process.argv.includes("--force")) {
      console.error(`${target} already exists; pass --force to overwrite`)
      process.exitCode = 1
      return
    }

    await fs.writeFile(target, `${JSON.stringify(manifest, null, 2)}\n`)
  }

  console.log(formatSeedReport(manifest, asJson))
}
