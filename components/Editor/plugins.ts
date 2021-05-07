import { Editor, Location, Transforms } from 'slate'
import imageExtensions from 'image-extensions'
import isUrl from 'is-url'
import { CustomElement, ImageElement } from './customType'
import { ReactEditor } from 'slate-react'

export const isImageUrl = (url: string): boolean => {
  if (!url) return false
  if (!isUrl(url)) return false
  const ext = new URL(url).pathname.split('.').pop()
  return imageExtensions.includes(ext)
}

export const insertImage = (editor: Editor, url: string): void => {
  if (!editor.selection) {
    return
  }
  return insertImageAt(editor, url, editor.selection)
}

export const insertImageAt = (
  editor: Editor,
  url: string,
  at: Location
): void => {
  const text = { text: '' }
  const image: ImageElement = { type: 'image', url, children: [text] }
  Transforms.insertNodes(editor, image, { at })
  Transforms.removeNodes(editor, { at })
  const nextLine = Editor.after(editor, at, { unit: 'line' })
  Transforms.insertNodes(
    editor,
    { type: 'paragraph', children: [{ text: '' }] },
    { at: nextLine, select: true }
  )
  ReactEditor.focus(editor)
}

export const withImages = (editor: Editor): Editor => {
  const { insertData, isVoid, deleteBackward } = editor

  editor.isVoid = (element) => {
    return element.type === 'image' ? true : isVoid(element)
  }

  editor.deleteBackward = (unit) => {
    const { selection } = editor

    if (selection) {
      const aboveLine = Editor.before(editor, selection, {
        distance: 1,
        unit: 'line',
      })

      // if current line have an above line
      if (aboveLine) {
        const [beforeNodeParent] = Editor.parent(editor, aboveLine)

        if ((beforeNodeParent as CustomElement).type === 'image') {
          Transforms.delete(editor, { at: selection })
          return
        }
      }
    }

    deleteBackward(unit)
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
