#!/usr/bin/env node
/**
 * Link rules globally to all supported IDEs.
 * Iterates IDE_RULE_TARGETS, skips IDEs not installed, processes each via linkRuleTarget.
 */
import { IDE_RULE_TARGETS } from "./lib/link/ideRuleTargets.mjs"
import { linkRuleTarget } from "./lib/link/linkRuleTarget.mjs"
import { pathExists } from "./lib/link/pathExists.mjs"

const main = async () => {
  let linked = 0
  let skipped = 0

  for (const ruleTarget of IDE_RULE_TARGETS) {
    const ideExists = await pathExists(ruleTarget.ide.rootDir)
    if (!ideExists) {
      console.log(`- ${ruleTarget.ide.id}: skipped (not installed)`)
      skipped++
      continue
    }

    const result = await linkRuleTarget(ruleTarget)

    const parts = []
    if (result.cleaned.length > 0) {
      parts.push(`cleaned ${result.cleaned.length}`)
    }
    if (result.linked > 0) {
      parts.push(`${result.linked} symlinked`)
    }
    if (result.copied > 0) {
      parts.push(`${result.copied} copied`)
    }

    console.log(`+ ${ruleTarget.ide.id}: ${parts.join(", ")}`)
    linked++
  }

  console.log(
    `\nDone: rules linked to ${linked} IDEs` + (skipped > 0 ? ` (${skipped} skipped)` : ""),
  )
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
