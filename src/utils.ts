export function pos2str(
  pos: { rowIndex: number; columnIndex: number } | [number, number]
): string {
  if (Array.isArray(pos)) {
    return `${pos[0]},${pos[1]}`
  }
  return `${pos.rowIndex},${pos.columnIndex}`
}

export function number2Alpha(num: number): string {
  let i = num
  let result = ''
  while (i >= 0) {
    result = 'abcdefghijklmnopqrstuvwxyz'[i % 26] + result
    i = ((i / 26) >> 0) - 1
  }
  return result
}
