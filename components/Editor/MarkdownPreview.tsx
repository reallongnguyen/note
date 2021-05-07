// @refresh reset
/* eslint-disable no-console */
import Prism, { Token } from 'prismjs'
import React, {
  useState,
  useCallback,
  useMemo,
  FC,
  useEffect,
  useRef,
  KeyboardEventHandler,
} from 'react'
import { Slate, Editable, withReact, ReactEditor } from 'slate-react'
import {
  Text,
  createEditor,
  Element,
  Descendant,
  Transforms,
  Range,
  Editor,
  Node,
  BaseRange,
} from 'slate'
import { withHistory } from 'slate-history'
import './prismMarkdown'
import Leaf from './Leaf'
import RenderElement from './RenderElement'
import { withImages, isImageUrl, insertImageAt } from './plugins'
import { CustomElement, CustomText, ImageElement } from './customType'
import { ImageOutline } from 'react-ionicons'

const serializeNode = (node: Node): string => {
  if (Text.isText(node)) {
    return node.text
  }

  if ((node as CustomElement).type === 'image') {
    const img = node as ImageElement
    return `![${img.alt || ''}](${img.url})`
  }

  const children = node.children.map((n) => serializeNode(n)).join('')

  return children
}

const serialize = (node: Node[]): string => {
  return node.map(serializeNode).join('\n')
}

const deserialize = (input: string): Descendant[] => {
  const lines = input.split('\n')
  return lines.map((line) => {
    const img = line.match(/^!\[([^\]]*)\]\(([^)]+)\)/)
    if (img) {
      return {
        type: 'image',
        url: img[2],
        alt: img[1],
        children: [{ text: '' }],
      }
    }
    return {
      type: 'paragraph',
      children: [{ text: line }],
    }
  })
}

export interface Props {
  contentId: number | string
  initialContent: string
  update: (content: string) => Promise<void>
}

const MarkdownPreview: FC<Props> = (props) => {
  const [value, setValue] = useState<Descendant[]>(emptyValue)
  const [emptyLinePos, setEmptyLinePos] = useState<BaseRange>(null)
  const plusBtnRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const updateTimerId = useRef<NodeJS.Timeout>(null)

  const renderLeaf = useCallback(
    (props) => (
      <Leaf {...props} changeURL={changeURL} changeHeading={changeHeading} />
    ),
    []
  )
  const renderElement = useCallback((props) => <RenderElement {...props} />, [])
  const editor = useMemo(
    () => withImages(withHistory(withReact(createEditor()))),
    []
  )
  const decorate = useCallback(([node, path]) => {
    const ranges = []

    if (!Text.isText(node)) {
      return ranges
    }

    const getLength = (token) => {
      if (typeof token === 'string') {
        return token.length
      } else if (typeof token.content === 'string') {
        return token.content.length
      } else {
        return token.content.reduce((l, t) => l + getLength(t), 0)
      }
    }

    const tokens = Prism.tokenize(node.text, Prism.languages.markdown)

    const decor = (start: number, tokens: (string | Token)[]) => {
      let s = start

      const linkToken = tokens.find(
        (i) => i instanceof Token && i.type === 'link'
      )

      const broRanges = {}

      for (const t of tokens) {
        const len = getLength(t)
        const e = s + len

        if (typeof t !== 'string') {
          broRanges[t.type] = {
            anchor: { path, offset: s },
            focus: { path, offset: e },
          }
          const range: Record<string, any> = {
            [t.type]: true,
            anchor: { path, offset: s },
            focus: { path, offset: e },
          }

          if (linkToken instanceof Token) {
            range.href = linkToken.content
          }

          if (Array.isArray(t.content)) {
            const { broRanges: insideRanges } = decor(s, t.content)
            range.insideRanges = insideRanges
          }

          ranges.push(range)
        }

        s = e
      }

      return {
        broRanges,
      }
    }

    decor(0, tokens)

    return ranges
  }, [])

  const changeURL = (leaf: any) => () => {
    Transforms.insertText(editor, '//isling.me', { at: leaf.insideRanges.link })
    Transforms.insertText(editor, 'isling', { at: leaf.insideRanges.name })
  }

  const changeHeading = (leaf: any) => () => {
    const range = leaf.insideRanges.punctuation
    const length = range.focus.offset - range.anchor.offset - 1
    const heading = '#'.repeat(length < 3 ? length + 1 : 1)

    Transforms.insertText(editor, `${heading} `, {
      at: leaf.insideRanges.punctuation,
    })
  }

  const addImage = () => {
    if (emptyLinePos) {
      const url = window.prompt('Enter the URL of the image:')
      if (url === null) {
        return
      }

      if (url && isImageUrl(url)) {
        insertImageAt(editor, url, emptyLinePos)
        setEmptyLinePos(undefined)
        return
      }

      alert(`URL '${url}' is not an image`)
    }
  }

  const handleChangeValue = (value: Descendant[]) => {
    setValue(value)
    if (updateTimerId.current) {
      clearTimeout(updateTimerId.current)
    }
    updateTimerId.current = setTimeout(() => handleUpdate(value), 2000)

    const { selection } = editor
    if (selection && Range.isCollapsed(selection)) {
      const [start] = Range.edges(selection)
      const [node] = Editor.node(editor, start)

      const [parentNode] = Editor.parent(editor, start)

      if (
        (node as CustomText).text === '' &&
        (parentNode as CustomElement).type === 'paragraph'
      ) {
        setEmptyLinePos(selection)
      } else {
        setEmptyLinePos(null)
      }
    }
  }

  const handleUpdate = (val: Descendant[]) => {
    const serialized = serialize(val)
    if (props.initialContent === '' && serialized === '# ') {
      return
    }
    props.update(serialized)
    console.log('updated', serialized)
  }

  const handleKeyPress: KeyboardEventHandler = (e) => {
    const { selection } = editor
    if (selection && Range.isCollapsed(selection)) {
      const [start] = Range.edges(selection)

      const [parentNode] = Editor.parent(editor, start)

      switch ((parentNode as CustomElement).type) {
        case 'image':
          if (e.code === 'Enter') {
            e.preventDefault()
            Transforms.insertNodes(editor, {
              type: 'paragraph',
              children: [{ text: '' }],
            })
          }
          break
      }
    }
  }

  // plus button position
  useEffect(() => {
    if (!emptyLinePos || !plusBtnRef.current || !scrollRef.current) {
      return
    }
    const ele = ReactEditor.toDOMRange(editor, emptyLinePos)
    const rec = ele.getBoundingClientRect()

    plusBtnRef.current.style.top = `calc(${rec.top}px)`
    plusBtnRef.current.style.left = `calc(${rec.left}px)`

    const scrollTopOnInit = scrollRef.current.scrollTop
    const handleScroll = () => {
      const curScrollTop = scrollRef.current.scrollTop
      const top = rec.top + scrollTopOnInit - curScrollTop
      if (plusBtnRef.current) {
        plusBtnRef.current.style.top = `calc(${top}px)`
      }
    }

    scrollRef.current.addEventListener('scroll', handleScroll)

    return () => {
      scrollRef.current?.removeEventListener('scroll', handleScroll)
    }
  }, [emptyLinePos])

  useEffect(() => {
    if (!editor) {
      return
    }
    setEmptyLinePos(null)

    if (props.initialContent === '') {
      setValue(emptyValue)
      setTimeout(() => {
        ReactEditor.focus(editor)
        Transforms.select(editor, [0])
        Transforms.move(editor, { unit: 'line', distance: 1 })
      }, 150)

      return
    }

    const initialValue = deserialize(props.initialContent)
    setValue(initialValue)
  }, [editor, props.contentId])

  return (
    <div ref={scrollRef} className="pt-6 h-full overflow-auto">
      <div className="h-full px-16 markdown">
        <Slate editor={editor} value={value} onChange={handleChangeValue}>
          <Editable
            decorate={decorate}
            renderLeaf={renderLeaf}
            renderElement={renderElement}
            onKeyPress={handleKeyPress}
          />
          {emptyLinePos && (
            <div ref={plusBtnRef} className="absolute">
              <div
                className="cursor-pointer w-8 h-8 flex justify-center items-center -translate-y-2 -translate-x-10 transform btn btn-rounded"
                onClick={addImage}
              >
                <ImageOutline width="1.2rem" style={{ color: 'inherit' }} />
              </div>
            </div>
          )}
        </Slate>
        <div className="h-32"></div>
      </div>
    </div>
  )
}

const emptyValue: Element[] = [
  {
    type: 'paragraph',
    children: [
      {
        text: '# ',
      },
    ],
  },
]

export default MarkdownPreview
