import path from "node:path"
import { HOME } from "./HOME"

const dir = process.env.CLAUDE_CONFIG_DIR?.trim()
export const CLAUDE_HOME = dir ?? path.join(HOME, ".claude")
