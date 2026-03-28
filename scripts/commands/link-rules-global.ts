import { IDE_RULE_TARGETS } from "../lib/link/constants/IDE_RULE_TARGETS"
import { linkRuleTarget } from "../lib/link/utils/linkRuleTarget"
import { pathExists } from "../lib/link/utils/pathExists"

export const main = async () => {
  let linked = 0
  let skipped = 0

  for (const ruleTarget of IDE_RULE_TARGETS) {
    const detectPaths = ruleTarget.ide.detectPaths ?? [ruleTarget.ide.rootDir]
    const detectResults = await Promise.all(detectPaths.map((candidate) => pathExists(candidate)))
    const ideExists = detectResults.some(Boolean)
    if (!ideExists) {
      console.log(`- ${ruleTarget.ide.id}: skipped (not installed)`)
      skipped++
      continue
    }

    const result = await linkRuleTarget(ruleTarget)

    const parts = []
    if (result.cleaned.length > 0) {
      parts.push(`cleaned ${String(result.cleaned.length)}`)
    }
    if (result.linked > 0) {
      parts.push(`${String(result.linked)} symlinked`)
    }
    if (result.copied > 0) {
      parts.push(`${String(result.copied)} copied`)
    }

    console.log(`+ ${ruleTarget.ide.id}: ${parts.join(", ")}`)
    linked++
  }

  console.log(
    `\nDone: rules linked to ${String(linked)} IDEs` +
      (skipped > 0 ? ` (${String(skipped)} skipped)` : ""),
  )
}

if (import.meta.url === `file://${String(process.argv[1])}`) {
  main().catch((error: unknown) => {
    console.error(error)
    process.exit(1)
  })
}
