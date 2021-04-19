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
  BaseRange,
} from 'slate'
import { withHistory } from 'slate-history'
import './prismMarkdown'
import Leaf from './Leaf'
import RenderElement from './RenderElement'
import { withImages, isImageUrl, insertImageAt } from './plugins'
import { CustomText } from './customType'
import { ImageOutline } from 'react-ionicons'

const MarkdownPreview: FC = () => {
  const [value, setValue] = useState<Descendant[]>(initialValue)
  const [emptyLinePos, setEmptyLinePos] = useState<BaseRange>(null)
  const plusBtnRef = useRef<HTMLDivElement>(null)
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
    console.log('tokens', tokens)

    const decor = (start: number, tokens: (string | Token)[]) => {
      let s = start

      const linkToken = tokens.find(
        (i) => i instanceof Token && i.type === 'link'
      )

      if (linkToken) {
        console.log('link token', linkToken)
      }

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
    Transforms.insertText(editor, 'long.me', { at: leaf.insideRanges.link })
    Transforms.insertText(editor, 'long', { at: leaf.insideRanges.name })
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
      if (url && !isImageUrl(url)) {
        alert('URL is not an image')
        return
      }

      insertImageAt(editor, url, emptyLinePos)
    }
  }

  const handleChangeValue = (value: Descendant[]) => {
    setValue(value)

    const { selection } = editor
    if (selection && Range.isCollapsed(selection)) {
      const [start] = Range.edges(selection)
      const [node] = Editor.node(editor, start)

      if ((node as CustomText).text === '') {
        setEmptyLinePos(selection)
      } else {
        setEmptyLinePos(null)
      }
    }
  }

  useEffect(() => {
    if (!emptyLinePos || !plusBtnRef.current) {
      return
    }
    const ele = ReactEditor.toDOMRange(editor, emptyLinePos)
    const rec = ele.getBoundingClientRect()

    plusBtnRef.current.style.top = `calc(${rec.top}px)`
    plusBtnRef.current.style.left = `calc(${rec.left}px)`
  }, [emptyLinePos])

  return (
    <Slate editor={editor} value={value} onChange={handleChangeValue}>
      <Editable
        decorate={decorate}
        renderLeaf={renderLeaf}
        renderElement={renderElement}
      />
      {emptyLinePos && (
        <div ref={plusBtnRef} className="fixed">
          <div
            className="cursor-pointer w-8 h-8 flex justify-center items-center rounded-full border border-gray-400 -translate-y-2 -translate-x-10 transform"
            onClick={addImage}
          >
            <ImageOutline width="1.2rem" style={{ color: '#f06332' }} />
          </div>
        </div>
      )}
    </Slate>
  )
}

const initialValue: Element[] = [
  {
    type: 'paragraph',
    children: [
      {
        text: '# Giới thiệu nhân vật Genshin Impact',
      },
    ],
  },
  {
    type: 'paragraph',
    children: [{ text: '## Nhà Thơ Có Màu Của Gió · Venti' }],
  },
  {
    type: 'paragraph',
    children: [
      {
        text:
          'Một thi hào có lai lịch không rõ ràng, có lúc cậu cất lên những bài thơ cũ rích, có khi cậu lại biết hát ra những bài ca mà chưa ai từng nghe cả. Thân phận thật sự là Phong Thần Barbatos.',
      },
    ],
  },
  {
    type: 'paragraph',
    children: [{ text: '### Thông tin' }],
  },
  {
    type: 'paragraph',
    children: [{ text: '- Hệ: Trap - Phong - Tửu' }],
  },
  {
    type: 'paragraph',
    children: [
      {
        text: '- Kỹ năng: Làm thơ, bắn bóng bay, nuno...',
      },
    ],
  },
  {
    type: 'paragraph',
    children: [
      {
        text: '- Danh ngôn: ehe',
      },
    ],
  },
  {
    type: 'paragraph',
    children: [
      {
        text: '## Qiqi · Thiếu nữ đáng yêu',
      },
    ],
  },
  {
    type: 'paragraph',
    children: [
      {
        text: '> Mình là Qiqi, là một cương thi... Ừm, phải nói gì nữa nhỉ...',
      },
    ],
  },
  {
    type: 'paragraph',
    children: [
      {
        text:
          "An apprentice and herb gatherer at Bubu Pharmacy. _Blessed_ by the [adepti](https://genshin-impact.fandom.com/wiki/Adepti) with a body that cannot die, this petite zombie cannot do anything without first giving herself orders to do it. Qiqi's memory is like a sieve. Out of necessity, she always carries around a notebook in which she writes anything important that she is sure to forget later. But on her worst days, she even forgets to look at her notebook...",
      },
    ],
  },
  {
    type: 'paragraph',
    children: [
      {
        text: '### Personality',
      },
    ],
  },
  {
    type: 'paragraph',
    children: [
      {
        text:
          "Qiqi has a quiet, yet polite demeanor when dealing with customers at the pharmacy. As a zombie, Qiqi has trouble retaining memories and can quickly forget about people if she doesn't continually reinforce herself with an impression of them. In addition to having a somewhat flat voice, she lacks the ability to properly form facial expressions due to her undead nature, which can make it difficult for her to convey emotion. Although zombies have to be issued orders when awoken, because Qiqi had done so herself, she has to give herself orders in order to perform her duties. She takes her duties seriously, carrying a notebook in which she details everything she needs to do for the day, which also serves as a reminder incase she forgets something. She also strides to improve herself so she becomes less forgetful.",
      },
    ],
  },
  {
    type: 'paragraph',
    children: [
      {
        text:
          'She uses her Cryo Vision to protect those that she cares for. Due to being a zombie, she prefers cold weather, as hot weather makes her feel uncomfortable.',
      },
    ],
  },
  {
    type: 'paragraph',
    children: [
      {
        text:
          'On particularly foul days however, **she may forget to check on her notebook**. She is also fond of `coconut milk` and finches for reasons unknown, though she initially mistakes the former as `cocogoat milk`.',
      },
    ],
  },
  {
    type: 'paragraph',
    children: [
      {
        text: '### Ghét >"<',
      },
    ],
  },
  {
    type: 'paragraph',
    children: [
      {
        text:
          '- [hutao](https://i.redd.it/94ic2qkkuh961.png) Con hutao mày đừng hù tao',
      },
    ],
  },
  {
    type: 'paragraph',
    children: [
      {
        text: '- [hutao](https://i.redd.it/94ic2qkkuh961.png)',
      },
    ],
  },
  {
    type: 'paragraph',
    children: [
      {
        text: '- [hutao](https://i.redd.it/94ic2qkkuh961.png)',
      },
    ],
  },
  {
    type: 'paragraph',
    children: [
      {
        text: '### Không ghét :>',
      },
    ],
  },
  {
    type: 'paragraph',
    children: [
      {
        text: '- anh **quái vật**',
      },
    ],
  },
  {
    type: 'paragraph',
    children: [
      {
        text: '- chị `dê dừa`',
      },
    ],
  },
]

export default MarkdownPreview
