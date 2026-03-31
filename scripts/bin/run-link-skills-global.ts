import { main } from "../commands/link-skills-global"

main().catch((error: unknown) => {
  console.error(error)
  process.exit(1)
})
