import { detectExecutor } from "../utils/detectExecutor"
import { skillDirs } from "./skillDirs"

export const method = detectExecutor(skillDirs[0] ?? "")
