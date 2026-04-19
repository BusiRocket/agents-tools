import { method } from "./method"
import { runToPrompt } from "../runners/runToPrompt"
import { skillDirs } from "./skillDirs"

export const result = runToPrompt(skillDirs, method as string)
