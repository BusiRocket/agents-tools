export function normalizeRel(rel: string) {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-conversion, @typescript-eslint/no-unnecessary-condition
  const s = String(rel ?? "")
    .replace(/\\/g, "/")
    .replace(/^\/+/, "")
  return s.replace(/(^|\/)\.\.(?=\/|$)/g, "")
}
