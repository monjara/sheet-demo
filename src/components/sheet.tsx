import type { Pos } from '@/type'
import { pos2str } from '@/utils'
import {
  Grid,
  type GridRef,
  useCopyPaste,
  useEditable,
  useSelection,
  useSizer,
} from '@rowsncolumns/grid'
import { useCallback, useMemo, useRef } from 'react'
import Cell, { type CellInfo } from './cell'
import Selection from './selection'

type SheetProps = {
  data: Record<string, CellInfo>
  setCellValue: (position: Pos, value: string) => void
  width: number
  height: number
}

export default function Sheet({
  data,
  setCellValue,
  width,
  height,
}: SheetProps) {
  const gridRef = useRef<GridRef>(null)
  const rowCount = 1000
  const columnCount = 1000
  const getValue = useCallback(
    ({ rowIndex, columnIndex }: { rowIndex: number; columnIndex: number }) => {
      return data[`${rowIndex},${columnIndex}`]?.value ?? ''
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
    /** unused */
    draggedSelection,
    appendSelection,
    isDragging,
    initialDraggedSelection,
    clearLastSelection,
    setActiveCellState,
    modifySelection,
    selectAll,
    clearSelections,
    ...selectionProps
  } = useSelection({
    gridRef,
    rowCount,
    columnCount,
    getValue,
    onFill: (activeCell, fillSelection) => {
      if (!fillSelection) return
      if (!getValueRef.current) return
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

  useCopyPaste({
    gridRef,
    selections,
    activeCell,
    getValue,
    getText: (cell) => {
      return getValue(cell)
    },
    onPaste: (rows, pos) => {
      if (!pos) return
      const { rowIndex, columnIndex } = pos
      const rowsSize = rows.length
      const endRowIndex = Math.max(rowIndex, rowIndex + rowsSize - 1)
      const endColumnIndex = Math.max(
        columnIndex,
        columnIndex + (rowsSize && rows[0].length - 1)
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
              // @ts-ignore todo
            } else if (cell.text) {
              // @ts-ignore
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

  const { editorComponent, isEditInProgress, onDoubleClick, ...editableProps } =
    useEditable({
      gridRef,
      getValue,
      selections,
      activeCell,
      columnCount,
      rowCount,
      isHiddenRow: () => false,
      isHiddenColumn: () => false,
      onKeyDown: (_) => {},
      canEdit: ({ rowIndex, columnIndex }) => {
        return rowIndex > 0 && columnIndex > 0
      },
      onDelete: (activeCell, selections) => {
        if (selections.length) {
          selections.reduce((acc, { bounds }) => {
            for (let i = bounds.top; i <= bounds.bottom; i++) {
              for (let j = bounds.left; j <= bounds.right; j++) {
                if (
                  getValueRef?.current &&
                  getValueRef.current({ rowIndex: i, columnIndex: j }) !==
                    undefined
                ) {
                  setCellValue([i, j], '')
                }
              }
            }
            return acc
          }, {})
          if (gridRef.current) {
            gridRef.current.resetAfterIndices(
              {
                rowIndex: selections[0].bounds.top,
                columnIndex: selections[0].bounds.left,
              },
              false
            )
          }
          if (gridRef.current) {
            gridRef.current.resetAfterIndices(
              {
                rowIndex: selections[0].bounds.top,
                columnIndex: selections[0].bounds.left,
              },
              false
            )
          }
        } else {
          if (gridRef.current) {
            gridRef.current.resetAfterIndices(activeCell)
          }
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
  const { getTextMetrics, getColumnWidth, ...autoSizerProps } = useSizer({
    gridRef,
    getValue,
    resizeStrategy: 'full',
    rowCount,
    minColumnWidth: 100,
    isHiddenColumn: () => false,
    isHiddenRow: () => false,
    getText: (cell) => {
      return getValue(cell)
    },
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
        {...selectionProps}
        {...autoSizerProps}
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
        selectionRenderer={Selection}
        itemRenderer={(props) => (
          <Cell
            {...props}
            key={props.key}
            data={data}
            selectionArea={selectionArea}
          />
        )}
        frozenColumns={frozenColumns}
        frozenRows={frozenRows}
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
