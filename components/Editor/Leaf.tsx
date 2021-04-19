/* eslint-disable no-console */
import { LinkOutline } from 'react-ionicons'
import { RenderLeafProps } from 'slate-react'
import { CustomText } from './customType'

type CustomFunc = Record<string, (l: CustomText) => () => void>

const Leaf = ({
  attributes,
  children,
  leaf,
  changeURL,
  changeHeading,
}: RenderLeafProps & CustomFunc): JSX.Element => {
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
          ${leaf.h1 && 'h-[2.1rem]'}
          ${leaf.h2 && 'h-[1.85rem]'}
          ${leaf.h3 && 'h-[1.6rem]'}
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
      <span className="relative" {...attributes}>
        <span className="hidden">{children}</span>
        <span
          className="absolute -left-4 text-red-450 font-bold select-none"
          contentEditable={false}
        >
          •
        </span>
      </span>
    )
  }

  if (leaf.list) {
    return <span {...attributes}>{children}</span>
  }

  return <span {...attributes}>{children}</span>
}

export default Leaf
