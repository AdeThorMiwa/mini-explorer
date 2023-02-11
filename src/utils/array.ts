export const getLastNBlockNumbers = (latestBlock: number, n: number) => {
  return Array.from({ length: n }, (v, i) => latestBlock - (n - (i + 1)))
}
