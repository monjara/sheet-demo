//import Grid, {
//  Cell,
//  useCopyPaste,
//  useEditable,
//  useSelection,
//  useTouch,
//  type CellInterface,
//  type RendererProps,
//} from '@rowsncolumns/grid'
//import { useCallback, useMemo, useRef, useState } from 'react'
//import { makeData, type Person } from '../../makeData'
//
//function renderCell({
//  data,
//  makeValue,
//  ...props
//}: RendererProps & {
//  data: Person[]
//  makeValue: (rowIndex: number, columnIndex: number) => string
//}) {
//  return (
//    <Cell
//      {...props}
//      value={makeValue(props.columnIndex, props.rowIndex)}
//      key={props.key}
//      stroke='#ccc'
//    />
//  )
//}
//const order = [
//  'firstName',
//  'lastName',
//  'age',
//  'visits',
//  'progress',
//  'status',
//  'createdAt',
//  'param_1',
//  'param_2',
//  'param_3',
//  'param_4',
//  'param_5',
//  'param_6',
//  'param_7',
//  'param_8',
//  'param_9',
//  'param_10',
//  'param_11',
//  'param_12',
//  'param_13',
//  'param_14',
//  'param_15',
//  'param_16',
//  'param_17',
//  'param_18',
//  'param_19',
//  'param_20',
//  'param_21',
//  'param_22',
//  'param_23',
//  'param_24',
//  'param_25',
//]
//
//function getValue(modified: string[][], cell: CellInterface) {
//  return modified[cell.columnIndex][cell.rowIndex]
//}
//
//export default function RowColumnsGrid() {
//  const gridRef = useRef(null)
//  const [data, _] = useState(() => makeData(10000))
//  const rowCount = 230
//  const columnCount = 10000
//
//  const modified = useMemo(() => {
//    const retval: string[][] = []
//    let i = 0
//    for (const d of data) {
//      retval[i] = []
//      let j = 0
//      for (const o of order) {
//        retval[i][j] = d[o as keyof Person].toString()
//        j++
//      }
//      i++
//    }
//    return retval
//  }, [data])
//
//  const makeValue = useCallback(
//    (columnIndex: number, rowIndex: number) => {
//      return modified?.[columnIndex]?.[rowIndex] ?? ''
//    },
//    [modified]
//  )
//
//  const {
//    selections,
//    setActiveCell,
//    setSelections,
//    newSelection,
//    ...selectionProps
//  } = useSelection({
//    gridRef,
//    rowCount,
//    columnCount,
//    allowDeselectSelection: true,
//    onSelectionMove(from, to) {
//      console.log('Selection move', from, to)
//    },
//    getValue: (cell: CellInterface) => getValue(modified, cell),
//    onFill: (activeCell, fillSelection) => {
//      console.log('Fill', activeCell, fillSelection)
//      if (!fillSelection) return
//      const { bounds } = fillSelection
//      const changes = {}
//      const previousChanges = {}
//
//      const value = getValue(modified, activeCell)
//      for (let i = bounds.top; i <= bounds.bottom; i++) {
//        for (let j = bounds.left; j <= bounds.right; j++) {
//          // @ts-ignore
//          changes[[i, j]] = value
//          // @ts-ignore
//          previousChanges[[i, j]] = getValue({ rowIndex: i, columnIndex: j })
//        }
//      }
//      console.log('value: ', value)
//    },
//  })
//
//  // @ts-ignore
//  const { editorComponent, editingCell, ...editableProps } = useEditable({
//    gridRef,
//    selections,
//    columnCount,
//    rowCount,
//    getValue: (cell: CellInterface) => getValue(modified, cell),
//    onSubmit: (value: string, cell: CellInterface) => {
//      modified[cell.columnIndex][cell.rowIndex] = value
//    },
//  })
//
//  //@ts-ignore
//  const copyPaste = useCopyPaste({
//    selections,
//    gridRef,
//    //onCopy: (selections) => {
//    //  console.log('onCopy', selections)
//    //},
//    onPaste: (rows, activeCell, selectionArea) => {
//      console.log('activeCell: ', activeCell)
//      modified[activeCell?.columnIndex as number][activeCell?.rowIndex as number] = rows[0]
//    },
//  })
//  const touch = useTouch({
//    gridRef,
//  })
//
//  return (
//    <div
//      style={{
//        position: 'relative',
//      }}
//    >
//      <Grid
//        ref={gridRef}
//        selections={selections}
//        rowCount={230}
//        columnCount={10000}
//        width={1000}
//        height={600}
//        rowHeight={() => 30}
//        columnWidth={() => 100}
//        itemRenderer={(props) => renderCell({ data, makeValue, ...props })}
//        enableCellOverlay
//        enableSelectionDrag
//        {...selectionProps}
//        {...copyPaste}
//        {...editableProps}
//        {...touch}
//        onMouseDown={(...args) => {
//          selectionProps.onMouseDown(...args)
//          editableProps.onMouseDown(...args)
//        }}
//        onKeyDown={(...args) => {
//          console.log('args: ', args)
//          selectionProps.onKeyDown(...args)
//          editableProps.onKeyDown(...args)
//        }}
//      />
//      {editorComponent}
//    </div>
//  )
//}

import {
  Cell,
  Grid,
  type GridRef,
  type RendererProps,
  useCopyPaste,
  useEditable,
  useSelection,
  useSizer,
  useUndo,
} from '@rowsncolumns/grid'
// @ts-nocheck
import { useCallback, useRef, useState } from 'react'

function number2Alpha(i: number): string {
  return (
    (i >= 26 ? number2Alpha(((i / 26) >> 0) - 1) : '') +
    'abcdefghijklmnopqrstuvwxyz'[(i % 26) >> 0]
  )
}

const Header = (props: RendererProps) => {
  const { rowIndex, columnIndex, columnHeader, isActive } = props
  const isCorner = rowIndex === columnIndex
  const text = isCorner
    ? ''
    : columnHeader
      ? (rowIndex as number)
      : (number2Alpha(columnIndex - 1).toUpperCase() as string as string)

  const fill = isActive ? '#E9EAED' : '#F8F9FA'

  return (
    <Cell
      {...props}
      value={text as string}
      fill={fill}
      stroke='#999'
      align='center'
    />
  )
}

type SheetProps = {
  data: Record<string, string | number>
}
const Sheet = ({ data }: SheetProps) => {
  const gridRef = useRef<GridRef>(null)
  const getValueRef = useRef()
  const rowCount = 1000
  const columnCount = 1000
  const getValue = useCallback(
    ({ rowIndex, columnIndex }: { rowIndex: number; columnIndex: number }) => {
      // @ts-ignore
      return data[[rowIndex, columnIndex]]
    },
    [data]
  )
  getValueRef.current = getValue
  const {
    activeCell,
    selections,
    setActiveCell,
    setSelections,
    newSelection,
    ...selectionProps
    // @ts-ignore
  } = useSelection({
    gridRef,
    rowCount,
    columnCount,
    onFill: (activeCell, fillSelection) => {
      if (!fillSelection) return
      const { bounds } = fillSelection
      const changes = {}
      const previousChanges = {}
      const value = getValueRef.current(activeCell)
      for (let i = bounds.top; i <= bounds.bottom; i++) {
        for (let j = bounds.left; j <= bounds.right; j++) {
          changes[[i, j]] = value
          previousChanges[[i, j]] = getValue({ rowIndex: i, columnIndex: j })
        }
      }
    },
  })
  const handleUndo = (patches) => {
    const { path, value } = patches
    const [key] = path
    if (key === 'data') {
      const [_, { rowIndex, columnIndex }] = path
      const changes = {
        [[rowIndex, columnIndex]]: value,
      }
      setActiveCell({ rowIndex, columnIndex })
    }

    if (key === 'range') {
      const [_, cell] = path
      setActiveCell(cell)
    }
  }
  const {
    undo,
    redo,
    add: addToUndoStack,
    canUndo,
    canRedo,
    ...undoProps
  } = useUndo({
    onUndo: handleUndo,
    onRedo: handleUndo,
  })
  // @ts-ignore
  useCopyPaste({
    gridRef,
    selections,
    activeCell,
    getValue,
    onPaste: (rows, { rowIndex, columnIndex }) => {
      const endRowIndex = Math.max(rowIndex, rowIndex + rows.length - 1)
      const endColumnIndex = Math.max(
        columnIndex,
        columnIndex + (rows.length && rows[0].length - 1)
      )
      const changes = {}
      for (const [i, row] of rows.entries()) {
        for (const [j, cell] of row.entries()) {
          if (typeof cell !== 'object') {
            const text = cell
              .replace(/\n/g, '')
              .replace(/\r/g, '')
              .replace(/ /g, '')
            changes[[rowIndex + i, columnIndex + j]] = text
          } else if (cell.text !== undefined) {
            changes[[rowIndex + i, columnIndex + j]] = cell.text
          }
        }
      }

      /* Should select */
      if (rowIndex === endRowIndex && columnIndex === endColumnIndex) return

      setSelections([
        {
          bounds: {
            top: rowIndex,
            left: columnIndex,
            bottom: endRowIndex,
            right: endColumnIndex,
          },
        },
      ])
    },
    onCut: (selection) => {
      const { bounds } = selection
      const changes = {}
      for (let i = bounds.top; i <= bounds.bottom; i++) {
        for (let j = bounds.left; j <= bounds.right; j++) {
          changes[[i, j]] = undefined
        }
      }
    },
  })

  // @ts-ignore
  const { editorComponent, isEditInProgress, ...editableProps } = useEditable({
    gridRef,
    getValue,
    selections,
    activeCell,
    onDelete: (activeCell, selections) => {
      /**
       * It can be a range of just one cell
       */
      if (selections.length) {
        const newValues = selections.reduce((acc, { bounds }) => {
          for (let i = bounds.top; i <= bounds.bottom; i++) {
            for (let j = bounds.left; j <= bounds.right; j++) {
              if (
                getValueRef.current({ rowIndex: i, columnIndex: j }) !==
                undefined
              ) {
                acc[[i, j]] = ''
              }
            }
          }
          return acc
        }, {})
        gridRef.current.resetAfterIndices(
          {
            rowIndex: selections[0].bounds.top,
            columnIndex: selections[0].bounds.left,
          },
          false
        )
      } else {
        gridRef.current.resetAfterIndices(activeCell)
      }
    },
    // TODO nextActiveCell has no rowindex...
    onSubmit: (value, cell, nextActiveCell) => {
      const { rowIndex, columnIndex } = cell
      const changes = {
        [[rowIndex, columnIndex]]: value,
      }
      const previousValue = getValueRef.current(cell)

      if (gridRef.current) {
        gridRef.current.resetAfterIndices({ rowIndex, columnIndex }, false)
      }
      //
      ///* Select the next cell */
      if (nextActiveCell?.rowIndex && nextActiveCell?.columnIndex) {
        setActiveCell(nextActiveCell)
      }
    },
  })
  // @ts-ignore
  const autoSizerProps = useSizer({
    gridRef,
    getValue,
    resizeStrategy: 'full',
    rowCount,
    minColumnWidth: 100,
  })
  const selectionArea = selections.reduce(
    (acc, { bounds }) => {
      for (let i = bounds.left; i <= bounds.right; i++) {
        acc.cols.push(i)
      }
      for (let i = bounds.top; i <= bounds.bottom; i++) {
        acc.rows.push(i)
      }
      return acc
    },
    { rows: [], cols: [] }
  )
  const frozenColumns = 1
  const frozenRows = 1
  return (
    <div
      style={{
        flex: 1,
        minWidth: 0,
        position: 'relative',
        top: 0,
      }}
    >
      <Grid
        // snap
        showFillHandle={!isEditInProgress}
        activeCell={activeCell}
        width={1000}
        height={1000}
        ref={gridRef}
        selections={selections}
        columnCount={columnCount}
        rowCount={rowCount}
        rowHeight={() => 22}
        scrollThrottleTimeout={50}
        itemRenderer={(props) => {
          if (props.rowIndex < frozenRows) {
            return (
              <Header
                {...props}
                key={props.key}
                isActive={
                  (activeCell &&
                    activeCell.columnIndex === props.columnIndex) ||
                  selectionArea.cols.includes(props.columnIndex)
                }
              />
            )
          }
          if (props.columnIndex < frozenColumns) {
            return (
              <Header
                {...props}
                key={props.key}
                columnHeader
                isActive={
                  (activeCell && activeCell.rowIndex === props.rowIndex) ||
                  selectionArea.rows.includes(props.rowIndex)
                }
              />
            )
          }
          const value = data[[props.rowIndex, props.columnIndex]]
          return (
            <Cell
              value={value}
              fill='white'
              stroke='#ccc'
              {...props}
              key={props.key}
            />
          )
        }}
        frozenColumns={frozenColumns}
        frozenRows={frozenRows}
        {...selectionProps}
        {...editableProps}
        {...autoSizerProps}
        columnWidth={(columnIndex) => {
          if (columnIndex === 0) return 46
          return autoSizerProps.columnWidth(columnIndex)
        }}
        onMouseDown={(...args) => {
          selectionProps.onMouseDown(...args)
          editableProps.onMouseDown(...args)
        }}
        onKeyDown={(...args) => {
          selectionProps.onKeyDown(...args)
          editableProps.onKeyDown(...args)
          undoProps.onKeyDown(...args)
        }}
      />
      {editorComponent}
    </div>
  )
}

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
  return (
    <div className='Container'>
      <div className='Container-Sheet'>
        <Sheet key={sheet.name} data={sheet.cells} />
      </div>
    </div>
  )
}
