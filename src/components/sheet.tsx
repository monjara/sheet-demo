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
import type { KonvaEventObject } from 'konva/lib/Node'
import { useCallback, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import Cell, { type CellInfo } from './cell'
import ContextMenu from './context-menu'
import Selection from './selection'
import styles from './sheet.module.css'

type SheetProps = {
  data: Record<string, CellInfo>
  setCellValue: (position: Pos, value: string) => void
  width: number
  height: number
}

type getTextProps = {
  text: string
  sourceCell: {
    rowIndex: number
    columnIndex: number
  }
}

export default function Sheet({
  data,
  width,
  height,
  setCellValue,
}: SheetProps) {
  const [menuContext, setMenuContext] = useState({
    show: false,
    position: { x: 0, y: 0 },
    cell: { rowIndex: 0, columnIndex: 0 },
  })
  const menuRef = useRef<HTMLDivElement | null>(null)

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
    onSelectionMouseDown,
    ...selectionProps
  } = useSelection({
    gridRef,
    rowCount,
    columnCount,
    getValue,
    selectionTopBound: 1,
    selectionLeftBound: 1,
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

  const { copy, cut, paste } = useCopyPaste({
    gridRef,
    selections,
    activeCell,
    getValue,
    getText: (config: getTextProps) => {
      return config.text
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
  //
  // TODO: resize
  const { getTextMetrics, getColumnWidth, ...autoSizerProps } = useSizer({
    autoResize: true,
    gridRef,
    getValue: getValueRef.current,
    resizeStrategy: 'lazy',
    rowCount,
    minColumnWidth: 100,
    isHiddenColumn: () => false,
    isHiddenRow: () => false,
    getText: (config: getTextProps) => {
      return config.text
    },
  })

  const toggleMenu = (
    e: KonvaEventObject<MouseEvent>,
    {
      rowIndex,
      columnIndex,
    }: {
      rowIndex: number
      columnIndex: number
    }
  ) => {
    if (rowIndex === 0) {
      setActiveCell({ rowIndex: rowIndex + 1, columnIndex })
      setSelections([
        {
          bounds: {
            top: rowIndex + 1,
            left: columnIndex,
            bottom: rowCount,
            right: columnIndex,
          },
        },
      ])
    } else {
      setActiveCell({ rowIndex, columnIndex: columnIndex + 1 })
      setSelections([
        {
          bounds: {
            top: rowIndex,
            left: columnIndex + 1,
            bottom: rowIndex,
            right: columnCount,
          },
        },
      ])
    }
    setMenuContext((old) => ({
      show: !old.show,
      position: { x: e.evt.clientX, y: e.evt.clientY },
      cell: { rowIndex, columnIndex },
    }))
  }

  const frozenColumns = 1
  const frozenRows = 1
  return (
    <div className={styles.container}>
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
            key={`${props.rowIndex}-${props.columnIndex}`}
            data={data[pos2str([props.rowIndex, props.columnIndex])]}
            activeCell={activeCell}
            selections={selections}
            toggleContext={toggleMenu}
          />
        )}
        frozenColumns={frozenColumns}
        frozenRows={frozenRows}
        onDoubleClick={onDoubleClick}
        columnWidth={(columnIndex) => {
          if (columnIndex === 0) return 52
          if (!autoSizerProps.columnWidth) return 52
          return autoSizerProps.columnWidth(columnIndex)
        }}
        onMouseDown={(e) => {
          selectionProps.onMouseDown(e)
          editableProps.onMouseDown(e)
        }}
        onKeyDown={(e) => {
          if (e.nativeEvent.key === 'Eisu') {
            return
          }
          if (e.nativeEvent.key === 'KanjiMode') {
            return
          }
          selectionProps.onKeyDown(e)
          editableProps.onKeyDown(e)
        }}
      />
      {editorComponent}
      {menuContext.show &&
        createPortal(
          <div ref={menuRef}>
            <ContextMenu
              selections={selections}
              data={data}
              position={menuContext.position}
              copy={copy}
              paste={paste}
              cut={cut}
              close={() => setMenuContext((old) => ({ ...old, show: false }))}
            />
          </div>,
          document.getElementById('root') as HTMLDivElement
        )}
    </div>
  )
}
