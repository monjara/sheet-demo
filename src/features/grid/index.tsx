import type { CellInterface } from '@rowsncolumns/grid'
// @ts-nocheck
import { useState } from 'react'
import Sheet from '../../components/Sheet'

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
export default function RowColumnsGrid() {
  const [cells, setCells] = useState(sheet.cells)
  const setCellValue = (position: CellInterface, value: number | string) => {
    const key = `${position.rowIndex},${position.columnIndex}`
    setCells((prev) => ({
      ...prev,
      [key]: value,
    }))
  }
  return <Sheet data={cells} setCellValue={setCellValue} />
}
