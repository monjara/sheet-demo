import type { ImageConfig } from 'konva/lib/shapes/Image'
import { useEffect, useState } from 'react'
import { Image } from 'react-konva'

type Props = Omit<ImageConfig, 'image'> & {
  src: string
}
export default function KonvaImage(props: Props) {
  const [image, setImage] = useState<HTMLImageElement | null>(null)

  useEffect(() => {
    const img = new window.Image()
    img.src = props.src
    img.onload = () => setImage(img)
  }, [props.src])

  return image ? <Image image={image} {...props} /> : null
}
