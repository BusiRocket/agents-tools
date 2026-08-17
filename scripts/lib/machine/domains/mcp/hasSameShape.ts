export const hasSameShape = (left: unknown, right: unknown) =>
  JSON.stringify(left) === JSON.stringify(right)
