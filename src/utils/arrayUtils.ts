export const range = (size: number, startAt: number = 0) => {
  return Array.from(Array(size).keys()).map((i) => i + startAt)
}

export const createArrayOfRange = <T>(
  generator: (i: number) => T,
  size: number,
  startAt?: number,
): T[] => range(size, startAt).map((i) => generator(i))
