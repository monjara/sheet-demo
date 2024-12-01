import { useRef } from 'react'
import styles from './context-menu.module.css'

type Props = {
  position: {
    x: number
    y: number
  }
}

export default function ContextMenu({ position }: Props) {
  const ref = useRef<HTMLDivElement | null>(null)

  return (
    <div
      ref={ref}
      className={styles.menu}
      style={{
        top: position.y,
        left: position.x,
      }}
    >
      <button
        className={styles.menu_row}
        type='button'
        onClick={() => console.log('copy')}
      >
        コピー
      </button>
      <button
        className={styles.menu_row}
        type='button'
        onClick={() => console.log('cut')}
      >
        切り取り
      </button>
      <button
        className={styles.menu_row}
        type='button'
        onClick={() => console.log('paste')}
      >
        貼り付け
      </button>
      <button
        className={styles.menu_row}
        type='button'
        onClick={() => console.log('filter')}
      >
        Filter
      </button>
    </div>
  )
}
