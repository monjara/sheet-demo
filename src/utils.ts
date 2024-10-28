export function pos2str(
  pos: { rowIndex: number; columnIndex: number } | [number, number]
): string {
  if (Array.isArray(pos)) {
    return `${pos[0]},${pos[1]}`
  }
  return `${pos.rowIndex},${pos.columnIndex}`
}
