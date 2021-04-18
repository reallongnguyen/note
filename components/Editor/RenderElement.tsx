import { RenderElementProps, useSelected, useFocused } from 'slate-react'

const Image = ({ attributes, children, element }) => {
  const selected = useSelected()
  const focused = useFocused()

  return (
    <div {...attributes}>
      <div contentEditable={false}>
        <img
          src={element.url}
          className={`block w-full ${
            selected && focused && 'element-selected'
          }`}
        />
      </div>
      {children}
    </div>
  )
}

const RenderElement = ({
  attributes,
  children,
  element,
}: RenderElementProps): any => {
  switch (element.type) {
    case 'paragraph':
      return <div {...attributes}>{children}</div>
    case 'image':
      return (
        <Image attributes={attributes} element={element}>
          {children}
        </Image>
      )
    default:
      return <div {...attributes}>{children}</div>
  }
}

export default RenderElement
