import { pos2str } from '@/utils'
import {
  type CellInterface,
  Cell as GridCell,
  type RendererProps,
  type SelectionArea,
} from '@rowsncolumns/grid'
import { memo } from 'react'
import SheetHeader from './sheet-header'

export type CellInfo = {
  value: string
  fill?: string
  textColor?: string
}

function isInColumnSelection(
  activeCell: CellInterface | null,
  selections: SelectionArea[],
  columnIndex: number
) {
  return (
    (activeCell && activeCell.columnIndex === columnIndex) ||
    selections.some(
      (selection) =>
        selection.bounds.left <= columnIndex &&
        selection.bounds.right >= columnIndex
    )
  )
}

function isInRowSelection(
  activeCell: CellInterface | null,
  selections: SelectionArea[],
  rowIndex: number
) {
  return (
    (activeCell && activeCell.rowIndex === rowIndex) ||
    selections.some(
      (selection) =>
        selection.bounds.top <= rowIndex && selection.bounds.bottom >= rowIndex
    )
  )
}

type Props = RendererProps & {
  activeCell: CellInterface | null
  data: Record<string, CellInfo>
  selections: SelectionArea[]
}
const Cell = memo<Props>(function Cell(props) {
  if (props.rowIndex < 1) {
    return (
      <SheetHeader
        {...props}
        key={`${props.rowIndex}_${props.columnIndex}`}
        isActive={isInColumnSelection(
          props.activeCell,
          props.selections,
          props.columnIndex
        )}
      />
    )
  }
  if (props.columnIndex < 1) {
    return (
      <SheetHeader
        {...props}
        key={`${props.rowIndex}_${props.columnIndex}`}
        columnHeader
        isActive={isInRowSelection(
          props.activeCell,
          props.selections,
          props.rowIndex
        )}
        rowIndex={props.rowIndex}
        columnIndex={props.columnIndex}
      />
    )
  }
  const cell = props.data[pos2str([props.rowIndex, props.columnIndex])]
  return (
    <GridCell
      {...props}
      key={`${props.rowIndex}_${props.columnIndex}`}
      value={cell?.value}
      fill={cell?.fill ?? '#fff'}
      textColor={cell?.textColor ?? '#000'}
      stroke='#ccc'
    />
  )
})

export default Cell
