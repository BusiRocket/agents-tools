import { SKILLS_DIR } from "./SKILLS_DIR"
import { listSkillDirs } from "../lib/skills/loaders/listSkillDirs"

export const skillDirs = await listSkillDirs(SKILLS_DIR)
