import { homedir } from "node:os"
import { join } from "node:path"
import { flagValue } from "../lib/machine/cli/flagValue"
import { readCurationManifest } from "../lib/library/cli/readCurationManifest"
import { resolveLibraryDir } from "../lib/library/cli/resolveLibraryDir"
import { expandPlannedLink } from "../lib/library/expandPlannedLink"
import { findLinkCollisions } from "../lib/library/findLinkCollisions"
import { installLink } from "../lib/library/installLink"
import { formatLinkReport } from "../lib/library/formatters/formatLinkReport"
import { planLinks } from "../lib/library/planLinks"
import { selectFannedOutSkills } from "../lib/library/selectors/selectFannedOutSkills"

export const main = async () => {
  const home = homedir()
  const asJson = process.argv.includes("--json")
  const dryRun = process.argv.includes("--dry-run")
  const target = flagValue(process.argv, "--target") ?? "claude"
  const flag = flagValue(process.argv, "--library")

  const libraryDir = resolveLibraryDir({
    ...(flag === undefined ? {} : { flag }),
    env: process.env,
    home,
  })

  const parsed = await readCurationManifest(libraryDir)

  if (!parsed.ok) {
    console.error(parsed.errors.join("\n"))
    process.exitCode = 1
    return
  }

  const skillsRoot = join(libraryDir, "skills")
  const planned = planLinks(skillsRoot, selectFannedOutSkills(parsed.manifest, target))
  const links = (await Promise.all(planned.map(expandPlannedLink))).flat()
  const collisions = findLinkCollisions(links)

  if (collisions.length > 0) {
    console.error(collisions.join("\n"))
    process.exitCode = 1
    return
  }

  const linkDir = flagValue(process.argv, "--into") ?? join(home, ".claude", "skills")
  const created: string[] = []
  const missing: string[] = []
  const foreign: string[] = []

  for (const link of links) {
    const outcome = await installLink(link, linkDir, dryRun)

    if (outcome.kind === "created") created.push(link.name)
    if (outcome.kind === "missing") missing.push(outcome.message)
    if (outcome.kind === "foreign") foreign.push(outcome.message)
  }

  console.log(
    formatLinkReport(
      { target, planned: links.length, linked: created.length, created, missing, foreign },
      asJson,
    ),
  )
}
