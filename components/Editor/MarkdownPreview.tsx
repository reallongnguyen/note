// @refresh reset
/* eslint-disable no-console */
import Prism, { Token, TokenObject } from 'prismjs'
import React, { useState, useCallback, useMemo, FC } from 'react'
import { Slate, Editable, withReact, RenderElementProps } from 'slate-react'
import { Text, createEditor, Element, Descendant, Transforms } from 'slate'
import { withHistory } from 'slate-history'
import { LinkOutline } from 'react-ionicons'

// eslint-disable-next-line
Prism.languages.markdown = Prism.languages.extend('markup', {})
Prism.languages.insertBefore('markdown', 'prolog', {
  title: [
    {
      pattern: /\w+.*(?:\r?\n|\r)(?:==+|--+)/,
      alias: 'important',
      inside: {
        punctuation: /==+$|--+$/,
      },
    },
  ],
  h1: {
    pattern: /(^\s*)#(?!#)\s.+/m,
    lookbehind: !0,
    alias: 'important',
    inside: { punctuation: /^#\s/ },
  },
  h2: {
    pattern: /(^\s*)#{2}(?!#)\s.+/m,
    lookbehind: !0,
    alias: 'important',
    inside: { punctuation: /^#{2}\s/ },
  },
  h3: {
    pattern: /(^\s*)#{3}(?!#)\s.+/m,
    lookbehind: !0,
    alias: 'important',
    inside: { punctuation: /^#{3}\s/ },
  },
  hr: {
    pattern: /(^\s*)([*-])([\t ]*\2){2,}(?=\s*$)/m,
    lookbehind: !0,
    alias: 'punctuation',
  },
  list: {
    pattern: /(^\s*)(?:[*+-])\s.+/m,
    lookbehind: !0,
    alias: 'important',
    inside: {
      punctuation: /(^\s*)(?:[*+-])+\s/m,
    },
  },
  code: [
    {
      pattern: /``.+?``|`[^`\n]+`/,
      alias: 'keyword',
    },
    {
      pattern: /```(\n|\r)(.|\r?\n|\r)*?```/,
      alias: 'keyword',
    },
  ],
  blockquote: {
    pattern: /^>(?:[\t ]*>)*\s.+/m,
    inside: {
      punctuation: /^>(?:[\t ]*>)*\s/,
    },
  },
  'url-reference': {
    pattern: /!?\[[^\]]+\]:[\t ]+(?:\S+|<(?:\\.|[^>\\])+>)(?:[\t ]+(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\((?:\\.|[^)\\])*\)))?/,
    inside: {
      variable: {
        pattern: /^(!?\[)[^\]]+/,
        lookbehind: !0,
      },
      string: /(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\((?:\\.|[^)\\])*\))$/,
      punctuation: /^[[\]!:]|[<>]/,
    },
    alias: 'url',
  },
  bold: {
    pattern: /(^|[^\\])(\*\*|__)(?:(?:\r?\n|\r)(?!\r?\n|\r)|.)+?\2/,
    lookbehind: !0,
    inside: {
      punctuation: /^\*\*|^__|\*\*$|__$/,
    },
  },
  italic: {
    pattern: /(^|[^\\])([*_])(?:(?:\r?\n|\r)(?!\r?\n|\r)|.)+?\2/,
    lookbehind: !0,
    inside: {
      punctuation: /^[*_]|[*_]$/,
    },
  },
  url: {
    pattern: /!?\[[^\]]+\](?:\([^\s)]+(?:[\t ]+"(?:\\.|[^"\\])*")?\)| ?\[[^\]\n]*\])/,
    inside: {
      variable: {
        pattern: /(!?\[)[^\]]+(?=\]$)/,
        lookbehind: !0,
      },
      link: {
        pattern: /[^()"]+?(?=(\)|\s))/,
      },
      name: {
        pattern: /[^[\]]+(?=\])/,
      },
      punctuation: /^\[|\)$|]|\(/,
    },
  },
})
;(Prism.languages.markdown.bold as TokenObject).inside.url = Prism.util.clone(
  Prism.languages.markdown.url
)
;(Prism.languages.markdown.italic as TokenObject).inside.url = Prism.util.clone(
  Prism.languages.markdown.url
)
;(Prism.languages.markdown
  .bold as TokenObject).inside.italic = Prism.util.clone(
  Prism.languages.markdown.italic
)
;(Prism.languages.markdown
  .italic as TokenObject).inside.bold = Prism.util.clone(
  Prism.languages.markdown.bold
)
;(Prism.languages.markdown.list as TokenObject).inside.url = Prism.util.clone(
  Prism.languages.markdown.url
)
;(Prism.languages.markdown.list as TokenObject).inside.code = Prism.util.clone(
  Prism.languages.markdown.code
)
;(Prism.languages.markdown.list as TokenObject).inside.bold = Prism.util.clone(
  Prism.languages.markdown.bold
)
;(Prism.languages.markdown
  .blockquote as TokenObject).inside.url = Prism.util.clone(
  Prism.languages.markdown.url
)

const MarkdownPreview: FC = () => {
  const [value, setValue] = useState<Descendant[]>(initialValue)
  const renderLeaf = useCallback(
    (props) => (
      <Leaf {...props} changeURL={changeURL} changeHeading={changeHeading} />
    ),
    []
  )
  const renderElement = useCallback((props) => <RenderElement {...props} />, [])
  const editor = useMemo(() => withHistory(withReact(createEditor())), [])
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

  return (
    <Slate editor={editor} value={value} onChange={(value) => setValue(value)}>
      <Editable
        decorate={decorate}
        renderLeaf={renderLeaf}
        renderElement={renderElement}
      />
    </Slate>
  )
}

const RenderElement = ({
  attributes,
  children,
  element,
}: RenderElementProps) => {
  switch (element.type) {
    case 'paragraph':
      return <div {...attributes}>{children}</div>
    default:
      return <div {...attributes}>{children}</div>
  }
}

const Leaf = ({ attributes, children, leaf, changeURL, changeHeading }) => {
  console.log('leaf', leaf)

  if (leaf.code) {
    return <code {...attributes}>{children}</code>
  }

  if (leaf.punctuation && (leaf.bold || leaf.italic || leaf.url)) {
    return (
      <span className="text-gray-300" {...attributes}>
        {children}
      </span>
    )
  }

  if (leaf.bold) {
    return (
      <strong className={leaf.italic ? `italic` : ''} {...attributes}>
        {children}
      </strong>
    )
  }

  if (leaf.italic) {
    return <em {...attributes}>{children}</em>
  }

  if (leaf.punctuation && (leaf.h1 || leaf.h2 || leaf.h3)) {
    return (
      <div
        className={`
          float-left relative
          ${leaf.h1 && 'h-8'}
          ${leaf.h2 && 'h-8'}
          ${leaf.h3 && 'h-7'}
        `}
        {...attributes}
      >
        <span className="hidden">{children}</span>
        <span
          className="absolute -left-6 text-sm font-sans text-gray-300 bottom-0 select-none cursor-default"
          onClick={changeHeading(leaf)}
          contentEditable={false}
        >
          H
          <span className="text-xs">
            {leaf.h1 && '1'}
            {leaf.h2 && '2'}
            {leaf.h3 && '3'}
          </span>
        </span>
      </div>
    )
  }

  if (leaf.h1) {
    return <h1 {...attributes}>{children}</h1>
  }

  if (leaf.h2) {
    return <h2 {...attributes}>{children}</h2>
  }

  if (leaf.h3) {
    return <h3 {...attributes}>{children}</h3>
  }

  if (leaf.hr) {
    return (
      <span className="text-center" {...attributes}>
        <span className="hidden">{children}</span>
        <hr contentEditable={false} className="select-none" />
      </span>
    )
  }

  if (leaf.url && leaf.link) {
    return (
      <span {...attributes}>
        <span className="hidden">{children}</span>
        <LinkOutline
          cssClasses="inline cursor-default select-none"
          onClick={changeURL(leaf)}
        />
      </span>
    )
  }

  if (leaf.url && leaf.name) {
    return (
      <span {...attributes}>
        <a
          className="text-red-450"
          href={leaf.href}
          target="_blank"
          rel="noreferrer"
          onClick={(e) => {
            e.preventDefault()
            window.open(leaf.href, '_blank')
          }}
        >
          {children}
        </a>
      </span>
    )
  }

  if (leaf.blockquote && leaf.punctuation) {
    return (
      <div className="float-left blockquote w-0" {...attributes}>
        <span className="invisible">{children}</span>
      </div>
    )
  }

  if (leaf.blockquote) {
    return <span {...attributes}>{children}</span>
  }

  if (leaf.list && leaf.punctuation) {
    return (
      <div className="relative" {...attributes}>
        <span className="hidden">{children}</span>
        <span
          className="absolute -left-4 text-red-450 font-bold select-none"
          contentEditable={false}
        >
          •
        </span>
      </div>
    )
  }

  if (leaf.list) {
    return <span {...attributes}>{children}</span>
  }

  return <span {...attributes}>{children}</span>
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
    children: [{ text: '' }],
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
