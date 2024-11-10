import type { CellInfo } from '@/components/cell'
import Sheet from '@/components/sheet'
import testData from '@/data.json'
import useResizer from '@/hooks/useResizer'
import type { Pos } from '@/type'
import { useRef, useState } from 'react'
import styles from './preview.module.css'

export default function Preview() {
  const [grid, setGrid] = useState(1)
  const [data, setData] = useState(() => {
    const properties = Object.keys(testData[0])

    const result: Record<string, CellInfo> = {}
    const propertySize = properties.length
    for (let i = 1; i <= propertySize; i++) {
      result[`${i},1`] = {
        value: properties[i - 1],
        fill: '#338aff',
        textColor: '#fff',
      }
    }
    for (let i = 2; i <= testData.length + 1; i++) {
      const row = testData[i - 2]
      for (let j = 1; j <= propertySize; j++) {
        // @ts-ignore
        result[`${j},${i}`] = { value: row[properties[j - 1]] }
      }
    }
    return result
  })
  const containerRef = useRef<HTMLDivElement>(null)

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

  const sheetWidth =
    grid > 1 ? window.innerWidth * 0.35 : window.innerWidth * 0.75
  const sheetHeight = window.innerHeight - 80

  const { width, height } = useResizer({
    width: sheetWidth,
    height: sheetHeight,
    multiple: grid > 1,
  })

  const onClickButton = () => {
    setGrid((g) => (g > 1 ? g - 1 : g + 1))
  }

  return (
    <div className={styles.container} ref={containerRef}>
      <div className={styles.button_area}>
        <button type='button' onClick={onClickButton}>
          {grid > 1 ? 'remove grid' : 'add grid'}
        </button>
      </div>

      <div className={styles.grid_area}>
        {Array.from({ length: grid }).map((_, i) => (
          <div key={i.toString()}>
            <Sheet
              data={data}
              setCellValue={setCellValue}
              width={width}
              height={height}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
