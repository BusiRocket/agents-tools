import fs from "node:fs"

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const lintData = JSON.parse(fs.readFileSync(".lint-scripts.json", "utf8"))

for (const fileResult of lintData) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  if (fileResult.errorCount === 0 && fileResult.warningCount === 0) continue

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
  const filePath = fileResult.filePath
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const fileContent = fs.readFileSync(filePath, "utf8")
  const lines = fileContent.split("\n")

  // Group messages by line
  const messagesByLine: Record<number, Set<string>> = {}
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  for (const msg of fileResult.messages) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (!msg.line) continue
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing, @typescript-eslint/no-unsafe-member-access
    if (!messagesByLine[msg.line]) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      messagesByLine[msg.line] = new Set()
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    messagesByLine[msg.line]?.add(String(msg.ruleId))
  }

  // We need to insert backwards to not mess up line numbers!
  const lineNumbers = Object.keys(messagesByLine)
    .map(Number)
    .sort((a, b) => b - a)

  for (const lineNum of lineNumbers) {
    const rules = Array.from(messagesByLine[lineNum] ?? []).join(", ")
    const zeroIndexed = lineNum - 1

    // Check if the previous line is already an eslint-disable
    const existingLine = zeroIndexed > 0 ? lines[zeroIndexed - 1] : undefined
    if (existingLine?.includes("eslint-disable-next-line")) {
      const match = /eslint-disable-next-line (.*)/.exec(existingLine)
      if (match?.[1]) {
        const existingRules = match[1].split(",").map((r) => r.trim())

        const newRules = Array.from(messagesByLine[lineNum] ?? []).filter(
          (r) => !existingRules.includes(r),
        )
        if (newRules.length > 0) {
          lines[zeroIndexed - 1] = existingLine + ", " + newRules.join(", ")
        }
        continue
      }
    }

    // Calculate indentation of the target line
    const targetLine = lines[zeroIndexed]
    const match = targetLine ? /^\s*/.exec(targetLine) : null
    const indent = match ? match[0] : ""

    lines.splice(zeroIndexed, 0, `${indent}// eslint-disable-next-line ${rules}`)
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  fs.writeFileSync(filePath, lines.join("\n"), "utf8")
  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  console.log(`Baselined ${filePath}`)
}
