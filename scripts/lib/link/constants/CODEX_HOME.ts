import path from "node:path"
import { HOME } from "./HOME"

const dir = process.env.CODEX_HOME?.trim()
export const CODEX_HOME = dir ?? path.join(HOME, ".codex")
