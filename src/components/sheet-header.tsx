import { Cell, type RendererProps } from '@rowsncolumns/grid'

function number2Alpha(i: number): string {
  return (
    (i >= 26 ? number2Alpha(((i / 26) >> 0) - 1) : '') +
    'abcdefghijklmnopqrstuvwxyz'[(i % 26) >> 0]
  )
}

export default function SheetHeader(props: RendererProps) {
  const { rowIndex, columnIndex, columnHeader, isActive } = props
  const isCorner = rowIndex === columnIndex
  const text = isCorner
    ? ''
    : columnHeader
      ? (rowIndex as number)
      : number2Alpha(columnIndex - 1).toUpperCase()

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
