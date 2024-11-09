import type { SelectionProps } from '@rowsncolumns/grid'
import type { CSSProperties } from 'react'
import { Fragment } from 'react/jsx-runtime'

export default function Selection({
  x = 0,
  y = 0,
  width = 0,
  height = 0,
  fill,
  stroke,
  strokeLeftColor = stroke,
  strokeTopColor = stroke,
  strokeRightColor = stroke,
  strokeBottomColor = stroke,
  strokeWidth = 0,
  key,
  strokeStyle = 'solid',
  fillOpacity = 1,
  draggable,
  isDragging,
  borderCoverWidth = 5,
  type,
  bounds,
  activeCell,
  ...props
}: SelectionProps) {
  const lineStyles: Partial<React.CSSProperties> = {
    borderWidth: 0,
    position: 'absolute',
    pointerEvents: 'none',
  }
  const borderCoverStyle: CSSProperties = {
    position: 'absolute',
    pointerEvents: draggable ? 'auto' : 'none',
    cursor: draggable ? (isDragging ? 'grabbing' : 'grab') : 'initial',
  }
  width = width - Math.floor(strokeWidth / 2)
  height = height - Math.floor(strokeWidth / 2)

  const borderCovers = [
    <div
      style={{
        ...borderCoverStyle,
        left: x,
        top: y,
        width: width + strokeWidth,
        height: 5,
      }}
      key='top'
      {...props}
    />,
    <div
      style={{
        ...borderCoverStyle,
        left: x + width,
        top: y,
        width: borderCoverWidth,
        height: height,
      }}
      key='right'
      {...props}
    />,
    <div
      style={{
        ...borderCoverStyle,
        left: x,
        top: y + height - borderCoverWidth + strokeWidth,
        width: width + strokeWidth,
        height: borderCoverWidth,
      }}
      key='bottom'
      {...props}
    />,
    <div
      style={{
        ...borderCoverStyle,
        left: x,
        top: y,
        width: borderCoverWidth,
        height: height,
      }}
      key='left'
      {...props}
    />,
  ]

  return (
    <Fragment key={key}>
      {fill && (
        <div
          style={{
            position: 'absolute',
            top: y,
            left: x,
            height,
            width,
            backgroundColor: fill,
            opacity: fillOpacity,
            userSelect: 'none',
            pointerEvents: 'none',
          }}
        />
      )}
      <div
        style={{
          ...lineStyles,
          left: x,
          top: y,
          width: width + strokeWidth,
          height: strokeWidth,
          borderColor: strokeTopColor,
          borderTopWidth: strokeWidth,
          borderStyle: strokeStyle,
        }}
        key='top'
        {...props}
      />
      ,
      <div
        style={{
          ...lineStyles,
          left: x + width - strokeWidth,
          top: y,
          width: strokeWidth,
          height: height,
          borderColor: strokeRightColor,
          borderRightWidth: strokeWidth,
          borderStyle: strokeStyle,
        }}
        key='right'
        {...props}
      />
      ,
      <div
        style={{
          ...lineStyles,
          left: x,
          top: y + height - strokeWidth,
          width: width + strokeWidth,
          height: strokeWidth,
          borderColor: strokeBottomColor,
          borderBottomWidth: strokeWidth,
          borderStyle: strokeStyle,
        }}
        key='bottom'
        {...props}
      />
      ,
      <div
        style={{
          ...lineStyles,
          left: x,
          top: y,
          width: strokeWidth,
          height: height,
          borderColor: strokeLeftColor,
          borderLeftWidth: strokeWidth,
          borderStyle: strokeStyle,
        }}
        key='left'
        {...props}
      />
      {draggable && borderCovers}
    </Fragment>
  )
}
