import { method } from "./method"
import { runToPrompt } from "../utils/runToPrompt"
import { skillDirs } from "./skillDirs"

export const result = runToPrompt(skillDirs, method as string)
