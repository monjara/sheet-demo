import 'canvas-datagrid'
import { useRef, useState } from 'react'

export default function CanvasDataGrid() {
  const ref = useRef(null)
  const [data, setData] = useState([
    { A: 'column1', B: 'column1' },
    { A: 'column2' },
  ])
  const btnClickFunc = () => {
    // ※ ref にてテーブル内のデータにアクセス可能。書き換えも可能。
    if (!ref.current) return
    console.log(ref.current)
    console.log(typeof ref.current)
    //ref.current.data.splice(1)
    //setGridData(ref.current.data)
  }
  return (
    <div>
      <h1>CanvasDataGrid</h1>
      <canvas-datagrid
        ref={ref}
        //style={{ height: '', width: '100%' }}
        data={JSON.stringify(data)}
      />
    </div>
  )
}
