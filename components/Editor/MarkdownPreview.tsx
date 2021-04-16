// @refresh reset
/* eslint-disable no-console */
import Prism, { Token, TokenObject } from 'prismjs'
import React, { useState, useCallback, useMemo, FC } from 'react'
import { Slate, Editable, withReact, RenderElementProps } from 'slate-react'
import { Text, createEditor, Element, Descendant } from 'slate'
import { withHistory } from 'slate-history'
import { LinkOutline } from 'react-ionicons'

// eslint-disable-next-line
Prism.languages.markdown = Prism.languages.extend('markup', {})
Prism.languages.insertBefore('markdown', 'prolog', {
  blockquote: {
    pattern: /^>(?:[\t ]*>)*\s[^\n\r]*/m,
    inside: {
      punctuation: /^>(?:[\t ]*>)*/,
      string: {
        pattern: /[^\n\r]+/,
      },
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
    inside: { punctuation: /^#\s|#$/ },
  },
  h2: {
    pattern: /(^\s*)#{2}(?!#)\s.+/m,
    lookbehind: !0,
    alias: 'important',
    inside: { punctuation: /^#{2}\s|#{2}$/ },
  },
  h3: {
    pattern: /(^\s*)#{3}(?!#)\s.+/m,
    lookbehind: !0,
    alias: 'important',
    inside: { punctuation: /^#{3}\s|#{3}$/ },
  },
  hr: {
    pattern: /(^\s*)([*-])([\t ]*\2){2,}(?=\s*$)/m,
    lookbehind: !0,
    alias: 'punctuation',
  },
  list: {
    pattern: /(^\s*)(?:[*+-]|\d+\.)(?=[\t ].)/m,
    lookbehind: !0,
    alias: 'punctuation',
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

const MarkdownPreview: FC = () => {
  const [value, setValue] = useState<Descendant[]>(initialValue)
  const renderLeaf = useCallback((props) => <Leaf {...props} />, [])
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

      for (const t of tokens) {
        const len = getLength(t)
        const e = s + len

        if (typeof t !== 'string') {
          ranges.push({
            [t.type]: true,
            href: linkToken instanceof Token ? linkToken.content : undefined,
            anchor: { path, offset: s },
            focus: { path, offset: e },
          })

          if (Array.isArray(t.content)) {
            decor(s, t.content)
          }
        }

        s = e
      }
    }

    decor(0, tokens)

    return ranges
  }, [])

  return (
    <Slate editor={editor} value={value} onChange={(value) => setValue(value)}>
      <Editable
        decorate={decorate}
        renderLeaf={renderLeaf}
        renderElement={renderElement}
        placeholder="Write some markdown..."
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

const Leaf = ({ attributes, children, leaf }) => {
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
    return (
      <span className="italic" {...attributes}>
        {children}
      </span>
    )
  }

  if (leaf.punctuation && (leaf.h1 || leaf.h2 || leaf.h3)) {
    return (
      <span className="hidden" {...attributes}>
        {children}
      </span>
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
      <span className="hidden float-left" {...attributes}>
        {children}
      </span>
    )
  }

  if (leaf.blockquote) {
    return <blockquote {...attributes}>{children}</blockquote>
  }

  if (leaf.hr) {
    return (
      <span className="text-center" {...attributes}>
        <span className="hidden">{children}</span>
        <hr />
      </span>
    )
  }

  if (leaf.url && leaf.link) {
    return (
      <span {...attributes}>
        <LinkOutline cssClasses="inline cursor-pointer" />
        <span className="hidden">{children}</span>
      </span>
    )
  }

  if (leaf.url && leaf.name) {
    return (
      <span {...attributes}>
        <a
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

  return <span {...attributes}>{children}</span>
}

const initialValue: Element[] = [
  {
    type: 'paragraph',
    children: [{ text: '# Overview' }],
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
    children: [{ text: '## The Problem' }],
  },
  {
    type: 'paragraph',
    children: [{ text: 'Software projects seldom meet the deadline.' }],
  },
  {
    type: 'paragraph',
    children: [{ text: '## The Consequences' }],
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
          '# Over-optimism, Dunning-Kruger effect, pure uncertainty, or just math?',
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
        text: '# It’s just math!',
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
