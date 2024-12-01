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
  data?: CellInfo
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
  return (
    <GridCell
      {...props}
      key={`${props.rowIndex}_${props.columnIndex}`}
      value={props.data?.value}
      fill={props.data?.fill ?? '#fff'}
      textColor={props.data?.textColor ?? '#000'}
      stroke='#ccc'
    />
  )
})

export default Cell
