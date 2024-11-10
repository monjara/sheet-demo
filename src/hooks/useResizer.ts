import { useEffect, useState } from 'react'

export default function useResizer({
  width: w,
  height: h,
  multiple,
}: { width: number; height: number; multiple?: boolean }) {
  const [width, setWidth] = useState(w)
  const [height, setHeight] = useState(h)

  useEffect(() => {
    setWidth(
      multiple
        ? window.innerWidth * 0.35
        : window.innerWidth - window.innerWidth * 0.3
    )

    const handler = () => {
      setWidth(
        multiple
          ? window.innerWidth * 0.35
          : window.innerWidth - window.innerWidth * 0.3
      )
      setHeight(h)
    }
    window.addEventListener('resize', handler)
    return () => {
      window.removeEventListener('resize', handler)
    }
  }, [h, multiple])

  return {
    width,
    height,
  }
}
