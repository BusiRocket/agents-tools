import { main } from "../commands/compile-skills"

main().catch((error: unknown) => {
  console.error(error)
  process.exit(1)
})
