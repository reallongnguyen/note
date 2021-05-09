import { FC, PropsWithChildren, useState, MouseEvent as ME } from 'react'

interface Props {
  maxWidth?: string
  defaultWidth: number
}

const Resizeable: FC<PropsWithChildren<Props>> = (props) => {
  const [width, setWidth] = useState<number>(props.defaultWidth)

  const handleMouseDown = (e: ME<HTMLDivElement, MouseEvent>) => {
    const beginX = e.pageX
    document.body.onmousemove = (e: MouseEvent) => {
      const currentX = e.pageX
      const currentWidth = width + (currentX - beginX)
      setWidth(currentWidth)
    }
  }

  const handleMouseUp = () => {
    document.body.onmousemove = undefined
  }

  return (
    <div className="relative h-full" style={{ width }}>
      <div className="absolute top-0 left-0 w-full h-full z-0">
        {props.children}
      </div>
      <div
        className="absolute right-0 top-0 h-full w-1 hover:border-r-2 border-blue-400 cursor-move z-10"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      />
    </div>
  )
}

export default Resizeable
