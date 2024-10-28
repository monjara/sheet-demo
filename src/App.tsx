// @ts-nocheck
import { useCallback, useState } from 'react'
import Sheet from './components/Sheet'
import type { Pos } from './type'

const sheet = {
  name: 'Sheet 1',
  cells: {
    '1,1': 'Hello',
    '1,2': 'World',
    '1,3': '=SUM(2,2)',
    '1,4': '=SUM(B2, 4)',
    '2,2': 10,
  },
}
export default function App() {
  const [cells, setCells] = useState(sheet.cells)

  const setCellValue = useCallback((position: Pos, value: number | string) => {
    const key = Array.isArray(position)
      ? `${position[0]},${position[1]}`
      : `${position.rowIndex},${position.columnIndex}`
    setCells((prev) => ({
      ...prev,
      [key]: value,
    }))
  }, [])

  return <Sheet data={cells} setCellValue={setCellValue} />
}
