import { promises as fs } from "node:fs"
import { homedir } from "node:os"
import { join } from "node:path"
import { flagValue } from "../lib/machine/cli/flagValue"
import { buildSkillKeyIndex } from "../lib/library/buildSkillKeyIndex"
import { listSkillPaths } from "../lib/library/cli/listSkillPaths"
import { readCurationManifest } from "../lib/library/cli/readCurationManifest"
import { resolveLibraryDir } from "../lib/library/cli/resolveLibraryDir"
import { formatProposals } from "../lib/library/formatters/formatProposals"
import { parseProceduresFile } from "../lib/library/learning/parseProceduresFile"
import { readInvocationCounts } from "../lib/library/learning/readInvocationCounts"
import { proposeChanges } from "../lib/library/learning/proposeChanges"

export const main = async () => {
  const home = homedir()
  const asJson = process.argv.includes("--json")
  const libraryFlag = flagValue(process.argv, "--library")
  const proceduresPath = flagValue(process.argv, "--procedures")

  if (proceduresPath === undefined) {
    console.error("usage: library:propose --procedures <file.json> [--json]")
    process.exitCode = 1
    return
  }

  const libraryDir = resolveLibraryDir({
    ...(libraryFlag === undefined ? {} : { flag: libraryFlag }),
    env: process.env,
    home,
  })

  const parsed = await readCurationManifest(libraryDir)

  if (!parsed.ok) {
    console.error(parsed.errors.join("\n"))
    process.exitCode = 1
    return
  }

  let procedures
  try {
    procedures = parseProceduresFile(
      JSON.parse(await fs.readFile(proceduresPath, "utf8")) as unknown,
    )
  } catch {
    console.error(`cannot read procedures from ${proceduresPath}`)
    process.exitCode = 1
    return
  }

  const invocations = await readInvocationCounts(join(libraryDir, "learning", "invocations.json"))

  const proposals = proposeChanges({
    procedures,
    manifest: parsed.manifest,
    invocations,
    target: flagValue(process.argv, "--target") ?? "claude",
    keyIndex: buildSkillKeyIndex(
      Object.keys(parsed.manifest.entries),
      await listSkillPaths(libraryDir),
    ),
  })

  console.log(formatProposals(proposals, asJson))
}
