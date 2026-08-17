import { promises as fs } from "node:fs"
import { homedir } from "node:os"
import { join } from "node:path"
import { flagValue } from "../lib/machine/cli/flagValue"
import { readCurationManifest } from "../lib/library/cli/readCurationManifest"
import { resolveLearningDir } from "../lib/library/cli/resolveLearningDir"
import { resolveLibraryDir } from "../lib/library/cli/resolveLibraryDir"
import { writeCurationManifest } from "../lib/library/cli/writeCurationManifest"
import { buildSkillKeyIndex } from "../lib/library/buildSkillKeyIndex"
import { listSkillPaths } from "../lib/library/cli/listSkillPaths"
import { collectTriggerPhrases } from "../lib/library/learning/collectTriggerPhrases"
import { mergeTriggersIntoManifest } from "../lib/library/learning/mergeTriggersIntoManifest"
import { observeTranscripts } from "../lib/library/learning/observeTranscripts"
import type { ObservationResult } from "../lib/library/learning/types/ObservationResult"

export const main = async () => {
  const home = homedir()
  const asJson = process.argv.includes("--json")
  const libraryFlag = flagValue(process.argv, "--library")
  const learningFlag = flagValue(process.argv, "--learning")

  const libraryDir = resolveLibraryDir({
    ...(libraryFlag === undefined ? {} : { flag: libraryFlag }),
    env: process.env,
    home,
  })

  const learningDir = resolveLearningDir({
    ...(learningFlag === undefined ? {} : { flag: learningFlag }),
    env: process.env,
    home,
  })

  const parsed = await readCurationManifest(libraryDir)

  if (!parsed.ok) {
    console.error(parsed.errors.join("\n"))
    process.exitCode = 1
    return
  }

  const root = flagValue(process.argv, "--transcripts") ?? join(home, ".claude", "projects")
  const observed: ObservationResult = await observeTranscripts(root, {})
  const phrases = collectTriggerPhrases(observed.sequence, 200)
  const keyIndex = buildSkillKeyIndex(
    Object.keys(parsed.manifest.entries),
    await listSkillPaths(libraryDir),
  )
  const next = mergeTriggersIntoManifest(parsed.manifest, phrases, keyIndex, 8)

  if (!process.argv.includes("--dry-run")) {
    await writeCurationManifest(libraryDir, next)
    await fs.mkdir(learningDir, { recursive: true })
    await fs.writeFile(
      join(learningDir, "trigger-phrases.json"),
      `${JSON.stringify(phrases, null, 2)}\n`,
    )
  }

  const learned = Object.entries(next.entries).filter(
    ([, entry]) => (entry.triggers ?? []).length > 0,
  )

  console.log(
    asJson
      ? JSON.stringify({ skillsWithTriggers: learned.length, phrases }, null, 2)
      : [
          `skills with measured trigger phrases: ${String(learned.length)}`,
          ...learned.map(([name, entry]) => `  ${name}: ${String((entry.triggers ?? []).length)}`),
        ].join("\n"),
  )
}
