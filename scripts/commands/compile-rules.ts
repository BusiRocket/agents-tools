import { main } from "./main"

// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error)
}
