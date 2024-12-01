import type { SelectionArea } from '@rowsncolumns/grid'
import { useEffect, useMemo, useRef } from 'react'
import type { CellInfo } from './cell'
import styles from './context-menu.module.css'

type Props = {
  selections: SelectionArea[]
  data: Record<string, CellInfo>
  position: {
    x: number
    y: number
  }
  copy: VoidFunction
  cut: VoidFunction
  paste: VoidFunction
  close: VoidFunction
}

export default function ContextMenu({
  selections,
  data,
  position,
  copy,
  paste,
  cut,
  close,
}: Props) {
  console.log('position.y: ', position.y)
  const ref = useRef<HTMLDivElement | null>(null)
  const filters = useMemo(() => {
    const filters = new Set<string>()
    const selection = selections[0]
    if (!selection?.bounds) return []
    const { bounds } = selection
    for (let i = bounds.top; i <= bounds.bottom; i++) {
      for (let j = bounds.left; j <= bounds.right; j++) {
        const key = `${i},${j}`
        if (data[key]) {
          filters.add(data[key].value)
        }
      }
    }
    return Array.from(filters)
  }, [data, selections])
  console.log('filters: ', filters)

  // biome-ignore lint: dd
  useEffect(() => {
    if (ref.current) {
      const handleClick = (e: MouseEvent) => {
        if (ref.current && !ref.current.contains(e.target as Node)) {
          close()
        }
      }

      document.addEventListener('mousedown', handleClick)
      return () => document.removeEventListener('mousedown', handleClick)
    }
  }, [])

  const onClickMenu = (exec: VoidFunction) => {
    exec()
    close()
  }

  return (
    <div
      ref={ref}
      className={styles.menu}
      style={{
        top: position.y < 80 ? position.y + 20 : 80,
        left: position.x,
      }}
    >
      <button
        className={styles.menu_row}
        type='button'
        onClick={() => onClickMenu(copy)}
      >
        コピー
      </button>
      <button
        className={styles.menu_row}
        type='button'
        onClick={() => onClickMenu(cut)}
      >
        切り取り
      </button>
      <button
        className={styles.menu_row}
        type='button'
        onClick={() => onClickMenu(paste)}
      >
        貼り付け
      </button>
      <div className={styles.divider} />
      <h6 className={styles.filter_title}>フィルタ</h6>
      <div className={styles.filter_area}>
        {filters.map((filter) => (
          <div key={filter}>
            <input type='checkbox' id={filter} name={filter} value={filter} />
            <label htmlFor={filter}>{filter}</label>
          </div>
        ))}
      </div>
    </div>
  )
}
