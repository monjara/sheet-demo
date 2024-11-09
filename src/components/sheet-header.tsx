import { Cell, type RendererProps } from '@rowsncolumns/grid'
import { memo } from 'react'

function number2Alpha(i: number): string {
  return (
    (i >= 26 ? number2Alpha(((i / 26) >> 0) - 1) : '') +
    'abcdefghijklmnopqrstuvwxyz'[(i % 26) >> 0]
  )
}

export default memo(function SheetHeader(props: RendererProps) {
  const { rowIndex, columnIndex, columnHeader, isActive } = props
  const isCorner = rowIndex === columnIndex
  const text = isCorner
    ? ''
    : columnHeader
      ? rowIndex.toString()
      : number2Alpha(columnIndex - 1).toUpperCase()

  const fill = isActive ? '#E9EAED' : '#F8F9FA'

  return (
    <Cell
      key={props.key}
      width={props.width}
      height={props.height}
      x={props.x}
      y={props.y}
      rowIndex={props.rowIndex}
      columnIndex={props.columnIndex}
      value={text}
      fill={fill}
      stroke='#999'
      align='center'
    />
  )
})
