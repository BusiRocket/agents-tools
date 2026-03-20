export interface RuleTarget {
  cleanup?: {
    dir: string
    prefix: string
  }
  links: {
    target: string
    method: "copy" | "link" | (string & {})
    source: string
  }[]
}
