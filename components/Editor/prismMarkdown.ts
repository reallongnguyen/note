import Prism, { TokenObject } from 'prismjs'

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
    pattern: /(^\s*)#(?!#)\s.*/m,
    lookbehind: !0,
    alias: 'important',
    inside: { punctuation: /^#\s(?=\S)|#/ },
  },
  h2: {
    pattern: /(^\s*)#{2}(?!#)\s.*/m,
    lookbehind: !0,
    alias: 'important',
    inside: { punctuation: /^#{2}\s(?=\S)|#{2}/ },
  },
  h3: {
    pattern: /(^\s*)#{3}(?!#)\s.*/m,
    lookbehind: !0,
    alias: 'important',
    inside: { punctuation: /^#{3}\s(?=\S)|#{3}/ },
  },
  hr: {
    pattern: /(^\s*)([*-])([\t ]*\2){2,}(?=\s*$)/m,
    lookbehind: !0,
    alias: 'punctuation',
  },
  list: {
    pattern: /(^\s*)(?:[*+-])\s.*/m,
    lookbehind: !0,
    alias: 'important',
    inside: {
      punctuation: /(^\s*)(?:[*+-])+\s(?=\S)|(^\s*)(?:[*+-])+/m,
    },
  },
  task: {
    pattern: /(^\s*)(?:\[[x]?\])\s.*/m,
    lookbehind: !0,
    alias: 'important',
    inside: {
      punctuation: /(^\s*)(?:\[[x]?\])\s(?=\S)|(^\s*)(?:\[[x]?\])/m,
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
    pattern: /^>(?:[\t ]*>)*\s.*/m,
    inside: {
      punctuation: /^>(?:[\t ]*>)*\s(?=\S)|>(?:[\t ]*>)*/,
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
  .list as TokenObject).inside.italic = Prism.util.clone(
  Prism.languages.markdown.italic
)
;(Prism.languages.markdown.task as TokenObject).inside.url = Prism.util.clone(
  Prism.languages.markdown.url
)
;(Prism.languages.markdown.task as TokenObject).inside.code = Prism.util.clone(
  Prism.languages.markdown.code
)
;(Prism.languages.markdown.task as TokenObject).inside.bold = Prism.util.clone(
  Prism.languages.markdown.bold
)
;(Prism.languages.markdown
  .task as TokenObject).inside.italic = Prism.util.clone(
  Prism.languages.markdown.italic
)
;(Prism.languages.markdown
  .blockquote as TokenObject).inside.url = Prism.util.clone(
  Prism.languages.markdown.url
)
