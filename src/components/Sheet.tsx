import {
  Cell,
  Grid,
  type GridRef,
  useCopyPaste,
  useEditable,
  useSelection,
  useSizer,
} from '@rowsncolumns/grid'
import { useCallback, useMemo, useRef } from 'react'
import useResizer from '../hooks/useResizer'
import type { Pos } from '../type'
import { pos2str } from '../utils'
import Header from './Header'

type SheetProps = {
  data: Record<string, string | number>
  setCellValue: (position: Pos, value: string | number) => void
}
export default function Sheet({ data, setCellValue }: SheetProps) {
  const { width, height } = useResizer()
  const gridRef = useRef<GridRef>(null)
  const rowCount = 1000
  const columnCount = 1000
  const getValue = useCallback(
    ({ rowIndex, columnIndex }: { rowIndex: number; columnIndex: number }) => {
      // @ts-ignore
      return data[[rowIndex, columnIndex]]
    },
    [data]
  )
  const getValueRef = useRef<typeof getValue | null>(null)
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
      const changes: Record<string, string> = {}
      const value = getValueRef.current(activeCell)
      for (let i = bounds.top; i <= bounds.bottom; i++) {
        for (let j = bounds.left; j <= bounds.right; j++) {
          changes[pos2str([i, j])] = value
        }
      }
    },
  })

  const selectionArea = useMemo(() => {
    type Acc = { rows: number[]; cols: number[] }
    return selections.reduce(
      (acc: Acc, { bounds }) => {
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
  }, [selections])

  // @ts-ignore
  useCopyPaste({
    gridRef,
    selections,
    activeCell,
    getValue,
    onPaste: (rows, pos) => {
      if (!pos) return
      const { rowIndex, columnIndex } = pos
      const endRowIndex = Math.max(rowIndex, rowIndex + rows.length - 1)
      const endColumnIndex = Math.max(
        columnIndex,
        columnIndex + (rows.length && rows[0].length - 1)
      )
      for (const [i, row] of rows.entries()) {
        for (const [j, cell] of row.entries()) {
          if (cell) {
            if (typeof cell !== 'object') {
              const text = cell
                .replace(/\n/g, '')
                .replace(/\r/g, '')
                .replace(/ /g, '')
              setCellValue([rowIndex + i, columnIndex + j], text)
            } else if (cell.text !== undefined) {
              setCellValue([rowIndex + i, columnIndex + j], cell.text)
            }
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
      for (let i = bounds.top; i <= bounds.bottom; i++) {
        for (let j = bounds.left; j <= bounds.right; j++) {
          setCellValue([i, j], '')
        }
      }
    },
  })

  const { editorComponent, isEditInProgress, onDoubleClick, ...editableProps } =
    // @ts-ignore
    useEditable({
      gridRef,
      getValue,
      selections,
      activeCell,
      canEdit: ({ rowIndex, columnIndex }) => {
        return rowIndex > 0 && columnIndex > 0
      },
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
                  setCellValue([i, j], '')
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
      onSubmit: (value, cell, nextActiveCell) => {
        const { rowIndex, columnIndex } = cell
        if (selections.length) {
          for (const selection of selections) {
            const { bounds } = selection
            for (let i = bounds.top; i <= bounds.bottom; i++) {
              for (let j = bounds.left; j <= bounds.right; j++) {
                setCellValue([i, j], value)
              }
            }
          }
        } else {
          setCellValue(cell, value)
        }

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
          const value = data[pos2str([props.rowIndex, props.columnIndex])]
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
        {...autoSizerProps}
        onDoubleClick={onDoubleClick}
        columnWidth={(columnIndex) => {
          if (columnIndex === 0) return 46
          if (!autoSizerProps.columnWidth) return 46
          return autoSizerProps.columnWidth(columnIndex)
        }}
        onMouseDown={(...args) => {
          selectionProps.onMouseDown(...args)
          editableProps.onMouseDown(...args)
        }}
        onKeyDown={(...args) => {
          selectionProps.onKeyDown(...args)
          editableProps.onKeyDown(...args)
        }}
      />
      {editorComponent}
    </div>
  )
}
