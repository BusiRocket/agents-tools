import { IDE_REGISTRY } from "../constants/IDE_REGISTRY"

export const findIde = (id: string) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
  const ide = IDE_REGISTRY.find((entry: any) => entry.id === id)
  if (!ide) {
    throw new Error(`Unknown IDE: ${id}`)
  }
  return ide
}
