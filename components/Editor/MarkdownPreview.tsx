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
  blockquote: {
    pattern: /^>(?:[\t ]*>)*\s.+/m,
    inside: {
      punctuation: /^>(?:[\t ]*>)*\s/,
    },
  },
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

  if (leaf.blockquote && leaf.punctuation) {
    return (
      <div className="hidden float-left" {...attributes}>
        {children}
      </div>
    )
  }

  if (leaf.blockquote) {
    return <blockquote {...attributes}>{children}</blockquote>
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
    return <div {...attributes}>{children}</div>
  }

  return <span {...attributes}>{children}</span>
}

const initialValue: Element[] = [
  {
    type: 'paragraph',
    children: [
      {
        text: '# Sample Note',
      },
    ],
  },
  {
    type: 'paragraph',
    children: [
      {
        text: '## Todo list',
      },
    ],
  },
  {
    type: 'paragraph',
    children: [
      {
        text: '- save note',
      },
    ],
  },
  {
    type: 'paragraph',
    children: [
      {
        text: '- edit note',
      },
    ],
  },
  {
    type: 'paragraph',
    children: [
      {
        text: '- add image',
      },
    ],
  },
  {
    type: 'paragraph',
    children: [
      {
        text: '- support url inside list, block quote...',
      },
    ],
  },
  {
    type: 'paragraph',
    children: [
      {
        text: '- code box',
      },
    ],
  },
  {
    type: 'paragraph',
    children: [
      {
        text: '- publish note',
      },
    ],
  },
  {
    type: 'paragraph',
    children: [{ text: '## Overview' }],
  },
  {
    type: 'paragraph',
    children: [
      {
        text:
          'Let’s first have a birds-eye view of the problem, the consequences, and the potential root causes. I will be covering most of these during this series.',
      },
    ],
  },
  {
    type: 'paragraph',
    children: [{ text: '### The Problem' }],
  },
  {
    type: 'paragraph',
    children: [{ text: 'Software projects seldom meet the deadline.' }],
  },
  {
    type: 'paragraph',
    children: [{ text: '### The Consequences' }],
  },
  {
    type: 'paragraph',
    children: [
      {
        text:
          'Marketing efforts can be wasted, clients can be dissatisfied, stressed developers can write poor quality code to meet deadlines and compromise product reliability, and ultimately, projects can outright get canceled.',
      },
    ],
  },
  {
    type: 'paragraph',
    children: [
      {
        text:
          '## Over-optimism, Dunning-Kruger effect, pure uncertainty, or just math?',
      },
    ],
  },
  {
    type: 'paragraph',
    children: [
      {
        text:
          'It’s easy to dismiss the concept of over-optimism all together just because it’s [common](https://isling.me) sense that no developer who ever struggled to meet a deadline will be optimistic when setting deadlines. Now if project management is not coming from an engineering background and they set deadlines without knowing what they are doing, that’s a whole different issue that is outside the scope of this article.',
      },
    ],
  },
  {
    type: 'paragraph',
    children: [
      {
        text:
          'Some also attribute bad time _estimation_ to the **Dunning-Kruger effect**, however, if inexperience or overestimating one’s ability is behind underestimating time then definitely more experience should alleviate the issue, right? The biggest companies out there with almost infinite resources still have a shockingly high rate of missing deadlines, so that hypothesis is debunked. Not to mention, we have all experienced this ourselves. More experience barely helps when it comes to time estimates.',
      },
    ],
  },
  {
    type: 'paragraph',
    children: [
      {
        text: '## It’s just math!',
      },
    ],
  },
  {
    type: 'paragraph',
    children: [
      {
        text:
          '> That’s where we need to draw the distinction that a single task isn’t representative of the project and vice versa.',
      },
    ],
  },
  {
    type: 'paragraph',
    children: [
      {
        text:
          'Normal distributions are all around us and the `human brain` is pretty used to them. We are experts at estimating things following a normal distribution by nature; **it’s the basis of _gaining_ experience by exposure.**',
      },
    ],
  },
  {
    type: 'paragraph',
    children: [
      {
        text: '# H1',
      },
    ],
  },
  {
    type: 'paragraph',
    children: [
      {
        text: '# H1',
      },
    ],
  },
  {
    type: 'paragraph',
    children: [
      {
        text: '## H2',
      },
    ],
  },
  {
    type: 'paragraph',
    children: [
      {
        text: '## H2',
      },
    ],
  },
  {
    type: 'paragraph',
    children: [
      {
        text: '### H3',
      },
    ],
  },
  {
    type: 'paragraph',
    children: [
      {
        text: '### H3',
      },
    ],
  },
  {
    type: 'paragraph',
    children: [
      {
        text: '- item 1',
      },
    ],
  },
  {
    type: 'paragraph',
    children: [
      {
        text: '- item 2',
      },
    ],
  },
]

export default MarkdownPreview
