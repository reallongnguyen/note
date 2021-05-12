import { RenderElementProps, useSelected, useFocused } from 'slate-react'

const Image = ({ attributes, children, element }) => {
  const selected = useSelected()
  const focused = useFocused()

  return (
    <div className="paragraph" {...attributes}>
      <img
        src={element.url}
        className={`block w-full select-none ${
          selected && focused && 'element-selected'
        }`}
        contentEditable={false}
      />
      {children}
    </div>
  )
}

const RenderElement = ({
  attributes,
  children,
  element,
}: RenderElementProps): JSX.Element => {
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
