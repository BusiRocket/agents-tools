import { ENTRYPOINTS } from "../constants/ENTRYPOINTS"
import { ROOT_FILE_TO_SEGMENT } from "../constants/ROOT_FILE_TO_SEGMENT"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function groupByTopSegment(items: { rel: string; content: string; [key: string]: any }[]) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const map: Record<string, any[]> = {}
  for (const item of items) {
    const parts = item.rel.split("/")
    // eslint-disable-next-line no-useless-assignment, sonarjs/no-dead-store
    let seg = "misc"
    if (parts.length === 1) {
      if (item.rel in ROOT_FILE_TO_SEGMENT)
        seg = ROOT_FILE_TO_SEGMENT[item.rel as keyof typeof ROOT_FILE_TO_SEGMENT]
      else if (ENTRYPOINTS.has(item.rel)) seg = "entrypoints"
      // eslint-disable-next-line sonarjs/no-redundant-assignments
      else seg = "misc"
    } else {
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      seg = parts[0] || "misc"
    }
    map[seg] = map[seg] ?? []
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    map[seg]!.push(item)
  }

  for (const seg of Object.keys(map)) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    map[seg]!.sort((a: any, b: any) => a.rel.localeCompare(b.rel))
  }

  return map
}
