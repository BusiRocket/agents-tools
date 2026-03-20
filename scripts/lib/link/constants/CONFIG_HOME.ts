import path from "node:path"
import { HOME } from "./HOME"

const dir = process.env.XDG_CONFIG_HOME?.trim()
export const CONFIG_HOME = dir ?? path.join(HOME, ".config")
