import type { CellInfo } from '@/components/cell'
import Sheet from '@/components/sheet'
import testData from '@/data.json'
import type { Pos } from '@/type'
import { useState } from 'react'
import styles from './preview.module.css'

export default function Preview() {
  const [data, setData] = useState(() => {
    const properties = Object.keys(testData[0])

    const result: Record<string, CellInfo> = {}
    for (let i = 1; i <= properties.length; i++) {
      result[`${i},1`] = {
        value: properties[i - 1],
        fill: '#338aff',
        textColor: '#fff',
      }
    }
    for (let i = 2; i <= testData.length + 1; i++) {
      const row = testData[i - 2]
      for (let j = 1; j <= properties.length; j++) {
        // @ts-ignore
        result[`${j},${i}`] = { value: row[properties[j - 1]] }
      }
    }
    return result
  })

  const setCellValue = (position: Pos, value: string) => {
    const key = Array.isArray(position)
      ? `${position[0]},${position[1]}`
      : `${position.rowIndex},${position.columnIndex}`
    setData((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        value,
      },
    }))
  }

  return (
    <div className={styles.container}>
      <Sheet data={data} setCellValue={setCellValue} />
    </div>
  )
}
