import Sheet from '@/components/sheet'
import type { Pos } from '@/type'
import { useState } from 'react'

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
export default function Preview() {
  const [data, setData] = useState(sheet.cells)
  const setCellValue = (position: Pos, value: number | string) => {
    const key = Array.isArray(position)
      ? `${position[0]},${position[1]}`
      : `${position.rowIndex},${position.columnIndex}`
    setData((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  return <Sheet data={data} setCellValue={setCellValue} />
}
