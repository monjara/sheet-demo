import 'canvas-datagrid'
import { useRef, useState } from 'react'

export default function CanvasDataGrid() {
  const ref = useRef(null)
  const [data] = useState([{ A: 'column1', B: 'column1' }, { A: 'column2' }])

  return (
    <div>
      <h1>CanvasDataGrid</h1>
      <canvas-datagrid ref={ref} data={JSON.stringify(data)} />
    </div>
  )
}
