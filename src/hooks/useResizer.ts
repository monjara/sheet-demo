import { useEffect, useState } from 'react'

export default function useResizer() {
  const [width, setWidth] = useState(window.innerWidth - 50)
  const [height, setHeight] = useState(window.innerHeight - 15)

  useEffect(() => {
    const handler = () => {
      setWidth(window.innerWidth - 50)
      setHeight(window.innerHeight - 15)
    }
    window.addEventListener('resize', handler)
    return () => {
      window.removeEventListener('resize', handler)
    }
  }, [])
  return {
    width,
    height,
  }
}
