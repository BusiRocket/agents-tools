/** Normalize line endings to \\n for stable diffs and cross-platform consistency. */
export function normalizeLineEndings(content: string) {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-conversion, @typescript-eslint/no-unnecessary-condition
  return String(content ?? "")
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
}
