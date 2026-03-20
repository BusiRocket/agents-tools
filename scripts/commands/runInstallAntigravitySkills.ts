import { installAntigravitySkills } from "./installAntigravitySkills"

installAntigravitySkills().catch((err: unknown) => {
  console.error(err)
  process.exit(1)
})
