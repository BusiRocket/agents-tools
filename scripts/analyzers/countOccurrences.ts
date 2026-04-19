export const countOccurrences = (content: string, pattern: string) => {
  let count = 0
  let start = 0
  for (;;) {
    const idx = content.indexOf(pattern, start)
    if (idx === -1) break
    count += 1
    start = idx + pattern.length
  }
  return count
}
