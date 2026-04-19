export const jaccardSimilarity = (left: Set<string>, right: Set<string>) => {
  const union = new Set([...left, ...right])
  if (union.size === 0) return 0

  let intersection = 0
  for (const token of left) {
    if (right.has(token)) intersection += 1
  }

  return intersection / union.size
}
