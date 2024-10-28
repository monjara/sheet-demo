import {
  Cell,
  type CellInterface,
  Grid,
  type GridRef,
  useCopyPaste,
  useEditable,
  useSelection,
  useSizer,
  useUndo,
} from '@rowsncolumns/grid'
// @ts-nocheck
import { useCallback, useRef } from 'react'
import useResizer from '../hooks/useResizer'
import Header from './Header'

type SheetProps = {
  data: Record<string, string | number>
  setCellValue: (position: CellInterface, value: string | number) => void
}
export default function Sheet({ data, setCellValue }: SheetProps) {
  const { width, height } = useResizer()
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
      setCellValue(cell, value)

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
        width={width}
        height={height}
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
