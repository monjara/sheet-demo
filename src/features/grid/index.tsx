import Grid, { Cell, useEditable, type RendererProps } from '@rowsncolumns/grid'
import { useRef, useState } from 'react'
import { makeData, type Person } from '../../makeData'

function renderCell({ data, ...props }: RendererProps & { data: Person[] }) {
  const makeValue = () => {
    const d = {
      '0': props.columnIndex.toString(),
      '1': data[props.columnIndex].firstName,
      '2': data[props.columnIndex].lastName,
      '3': data[props.columnIndex].age.toString(),
      '4': data[props.columnIndex].visits.toString(),
      '5': data[props.columnIndex].progress.toString(),
      '6': data[props.columnIndex].status.toString(),
      '7': data[props.columnIndex].createdAt.toISOString(),
      '8': data[props.columnIndex].createdAt.toISOString(),
      '9': data[props.columnIndex].createdAt.toISOString(),
      '10': data[props.columnIndex].createdAt.toISOString(),
      '11': data[props.columnIndex].createdAt.toISOString(),
      '12': data[props.columnIndex].createdAt.toISOString(),
      '13': data[props.columnIndex].createdAt.toISOString(),
      '14': data[props.columnIndex].createdAt.toISOString(),
      '15': data[props.columnIndex].createdAt.toISOString(),
      '16': data[props.columnIndex].createdAt.toISOString(),
      '17': data[props.columnIndex].createdAt.toISOString(),
      '18': data[props.columnIndex].createdAt.toISOString(),
      '19': data[props.columnIndex].createdAt.toISOString(),
      '20': data[props.columnIndex].createdAt.toISOString(),
      ...Array.from({ length: 200 }, (_, i) => [
        i + 21,
        data[props.columnIndex].createdAt.toISOString(),
      ]).reduce((acc, [key, value]) => {
        // @ts-ignore
        acc[key] = value
        return acc
      }, {}),
    }[props.rowIndex]

    return d ?? ''
  }
  return <Cell {...props} value={makeValue()} />
}

export default function RowColumnsGrid() {
  const [data, _] = useState(() => makeData(10000))
  const gridRef = useRef(null)

  return (
    <Grid
      ref={gridRef}
      rowCount={230}
      columnCount={10000}
      width={1000}
      height={600}
      rowHeight={() => 20}
      columnWidth={() => 100}
      itemRenderer={(props) => renderCell({ data, ...props })}
      enableCellOverlay
      enableSelectionDrag
    />
  )
}
