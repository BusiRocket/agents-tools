import { detectExecutor } from "../utils/detectExecutor"
import { skillDirs } from "./skillDirs"

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
export const method = detectExecutor(skillDirs[0]!)
