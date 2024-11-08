import { useEffect, useState } from 'react'

export default function useResizer({
  width: w,
  height: h,
}: { width: number; height: number }) {
  const [width, setWidth] = useState(w)
  const [height, setHeight] = useState(h)

  useEffect(() => {
    const handler = () => {
      setWidth(w)
      setHeight(h)
    }
    window.addEventListener('resize', handler)
    return () => {
      window.removeEventListener('resize', handler)
    }
  }, [w, h])

  return {
    width,
    height,
  }
}
