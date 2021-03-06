import { Descendant, BaseEditor } from 'slate'
import { ReactEditor } from 'slate-react'
import { HistoryEditor } from 'slate-history'

export type BlockQuoteElement = { type: 'block-quote'; children: Descendant[] }

export type BulletedListElement = {
  type: 'bulleted-list'
  children: Descendant[]
}

export type CheckListItemElement = {
  type: 'check-list-item'
  checked: boolean
  children: Descendant[]
}

export type EditableVoidElement = {
  type: 'editable-void'
  children: EmptyText[]
}

export type HeadingElement = { type: 'heading'; children: Descendant[] }

export type HeadingTwoElement = { type: 'heading-two'; children: Descendant[] }

export type HeadingThreeElement = {
  type: 'heading-three'
  children: Descendant[]
}

export type ImageElement = {
  type: 'image'
  url: string
  alt?: string
  children: EmptyText[]
}

export type LinkElement = { type: 'link'; url: string; children: Descendant[] }

export type ListItemElement = { type: 'list-item'; children: Descendant[] }

export type MentionElement = {
  type: 'mention'
  character: string
  children: CustomText[]
}

export type ParagraphElement = { type: 'paragraph'; children: Descendant[] }

export type TableElement = { type: 'table'; children: TableRow[] }

export type TableCellElement = { type: 'table-cell'; children: CustomText[] }

export type TableRowElement = { type: 'table-row'; children: TableCell[] }

export type TitleElement = { type: 'title'; children: Descendant[] }

export type VideoElement = { type: 'video'; url: string; children: EmptyText[] }

export type HRElement = { type: 'hr'; text: string }

type CustomElement =
  // | BlockQuoteElement
  // | BulletedListElement
  // | CheckListItemElement
  // | EditableVoidElement
  // | HeadingElement
  // | HeadingTwoElement
  // | HeadingThreeElement
  // | HRElement
  | ImageElement
  // | LinkElement
  // | ListItemElement
  // | MentionElement
  | ParagraphElement
// | TableElement
// | TableRowElement
// | TableCellElement
// | TitleElement
// | VideoElement

export type CustomText = {
  text: string
  bold?: boolean
  italic?: boolean
  code?: boolean
  punctuation?: boolean
  url?: boolean
  link?: boolean // url inside property
  name?: boolean // url inside property
  href?: string // url href
  h1?: boolean
  h2?: boolean
  h3?: boolean
  firstSpace?: boolean
  hr?: boolean
  blockquote?: boolean
  list?: boolean
  task?: boolean
}

export type CustomEditor = BaseEditor & ReactEditor & HistoryEditor

declare module 'slate' {
  interface CustomTypes {
    Editor: CustomEditor
    Element: CustomElement
    Text: CustomText
  }
}
