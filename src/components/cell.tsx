import { pos2str } from '@/utils'
import { Cell as GridCell, type RendererProps } from '@rowsncolumns/grid'
import { memo } from 'react'
import SheetHeader from './sheet-header'
export type CellInfo = {
  value: string
  fill?: string
  textColor?: string
}

type Props = RendererProps & {
  data: Record<string, CellInfo>
}

export default memo(function Cell(props: Props) {
  if (props.rowIndex < 1) {
    return (
      <SheetHeader
        {...props}
        key={props.key}
        isActive={
          (props.activeCell &&
            props.activeCell.columnIndex === props.columnIndex) ||
          props.selectionArea.cols.includes(props.columnIndex)
        }
      />
    )
  }
  if (props.columnIndex < 1) {
    return (
      <SheetHeader
        {...props}
        key={props.key}
        columnHeader
        isActive={
          (props.activeCell && props.activeCell.rowIndex === props.rowIndex) ||
          props.selectionArea.rows.includes(props.rowIndex)
        }
      />
    )
  }
  const cell = props.data[pos2str([props.rowIndex, props.columnIndex])]
  return (
    <GridCell
      {...props}
      key={props.key}
      value={cell?.value}
      fill={cell?.fill ?? '#fff'}
      textColor={cell?.textColor ?? '#000'}
      stroke='#ccc'
    />
  )
})
