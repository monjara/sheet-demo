import Grid, {
  Cell,
  useCopyPaste,
  useEditable,
  useSelection,
  useTouch,
  type CellInterface,
  type RendererProps,
} from '@rowsncolumns/grid'
import { useCallback, useMemo, useRef, useState } from 'react'
import { makeData, type Person } from '../../makeData'

function renderCell({
  data,
  makeValue,
  ...props
}: RendererProps & {
  data: Person[]
  makeValue: (rowIndex: number, columnIndex: number) => string
}) {
  return (
    <Cell
      {...props}
      value={makeValue(props.columnIndex, props.rowIndex)}
      key={props.key}
      stroke='#ccc'
    />
  )
}
const order = [
  'firstName',
  'lastName',
  'age',
  'visits',
  'progress',
  'status',
  'createdAt',
  'param_1',
  'param_2',
  'param_3',
  'param_4',
  'param_5',
  'param_6',
  'param_7',
  'param_8',
  'param_9',
  'param_10',
  'param_11',
  'param_12',
  'param_13',
  'param_14',
  'param_15',
  'param_16',
  'param_17',
  'param_18',
  'param_19',
  'param_20',
  'param_21',
  'param_22',
  'param_23',
  'param_24',
  'param_25',
]

function getValue(modified: string[][], cell: CellInterface) {
  return modified[cell.columnIndex][cell.rowIndex]
}

export default function RowColumnsGrid() {
  const gridRef = useRef(null)
  const [data, _] = useState(() => makeData(10000))
  const rowCount = 230
  const columnCount = 10000

  const modified = useMemo(() => {
    const retval: string[][] = []
    let i = 0
    for (const d of data) {
      retval[i] = []
      let j = 0
      for (const o of order) {
        retval[i][j] = d[o as keyof Person].toString()
        j++
      }
      i++
    }
    return retval
  }, [data])

  const makeValue = useCallback(
    (columnIndex: number, rowIndex: number) => {
      return modified?.[columnIndex]?.[rowIndex] ?? ''
    },
    [modified]
  )

  const { selections, ...selectionProps } = useSelection({
    gridRef,
    rowCount,
    columnCount,
    allowDeselectSelection: true,
    onSelectionMove(from, to) {
      console.log('Selection move', from, to)
    },
    getValue: (cell: CellInterface) => getValue(modified, cell),
    onFill: (activeCell, fillSelection) => {
      console.log('Fill', activeCell, fillSelection)
    },
  })

  // @ts-ignore
  const { editorComponent, editingCell, ...editableProps } = useEditable({
    gridRef,
    selections,
    columnCount,
    rowCount,
    getValue: (cell: CellInterface) => getValue(modified, cell),
    onSubmit: (value: string, cell: CellInterface) => {
      modified[cell.columnIndex][cell.rowIndex] = value
    },
  })

  //@ts-ignore
  const copyPaste = useCopyPaste({
    selections,
    gridRef,
    onCopy: (selections) => {
      console.log('onCopy', selections)
    },
    onPaste: (rows, activeCell, selectionArea) => {
      console.log('onPaste', rows, activeCell, selectionArea)
    },
  })
  const touch = useTouch({
    gridRef,
  })

  return (
    <div
      style={{
        position: 'relative',
      }}
    >
      <Grid
        ref={gridRef}
        selections={selections}
        rowCount={230}
        columnCount={10000}
        width={1000}
        height={600}
        rowHeight={() => 20}
        columnWidth={() => 100}
        itemRenderer={(props) => renderCell({ data, makeValue, ...props })}
        enableCellOverlay
        enableSelectionDrag
        {...selectionProps}
        {...editableProps}
        {...touch}
        onMouseDown={(...args) => {
          selectionProps.onMouseDown(...args)
          editableProps.onMouseDown(...args)
        }}
        onKeyDown={(...args) => {
          console.log('args: ', args)
          selectionProps.onKeyDown(...args)
          editableProps.onKeyDown(...args)
        }}
      />
      {editorComponent}
    </div>
  )
}
