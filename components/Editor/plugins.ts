import { Editor, Location, Transforms } from 'slate'
import imageExtensions from 'image-extensions'
import isUrl from 'is-url'
import { ImageElement } from './customType'
import { ReactEditor } from 'slate-react'

export const isImageUrl = (url: string): boolean => {
  if (!url) return false
  if (!isUrl(url)) return false
  const ext = new URL(url).pathname.split('.').pop()
  return imageExtensions.includes(ext)
}

export const insertImage = (editor: Editor, url: string): void => {
  return insertImageAt(editor, url, editor.selection)
}

export const insertImageAt = (
  editor: Editor,
  url: string,
  at: Location
): void => {
  const text = { text: '' }
  const image: ImageElement = { type: 'image', url, children: [text] }
  Transforms.removeNodes(editor, { at })
  Transforms.insertNodes(editor, image, { at })
  const nextLine = Editor.after(editor, at, { unit: 'line' })
  Transforms.insertNodes(
    editor,
    { type: 'paragraph', children: [{ text: '' }] },
    { at: nextLine, select: true }
  )
  ReactEditor.focus(editor)
}

export const withImages = (editor: Editor): Editor => {
  const { insertData, isVoid } = editor

  editor.isVoid = (element) => {
    return element.type === 'image' ? true : isVoid(element)
  }

  editor.insertData = (data) => {
    const { files } = data

    if (files && files.length > 0) {
      for (const file of Array.from(files)) {
        const reader = new FileReader()
        const [mime] = file.type.split('/')

        if (mime === 'image') {
          reader.addEventListener('load', () => {
            const url =
              typeof reader.result === 'string'
                ? reader.result
                : String.fromCharCode.apply(null, reader.result)
            insertImage(editor, url)
          })

          reader.readAsDataURL(file)
        }
      }
    } else {
      insertData(data)
    }
  }

  return editor
}
