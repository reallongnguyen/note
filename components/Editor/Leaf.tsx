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

  if (leaf.firstSpace) {
    return (
      <span
        {...attributes}
        className={`
        ml-[-0.35rem]
        ${leaf.h1 && 'h1 ml-[-0.51rem]'}
        ${leaf.h2 && 'h2 ml-[-0.45rem]'}
        ${leaf.h3 && 'h3 ml-[-0.35rem]'}
      `}
      >
        {children}
      </span>
    )
  }

  if (leaf.punctuation && (leaf.h1 || leaf.h2 || leaf.h3)) {
    return (
      <span
        className={`
          relative bg-green-100
          ${leaf.h1 && 'h1'}
          ${leaf.h2 && 'h2'}
          ${leaf.h3 && 'h3'}
        `}
        {...attributes}
      >
        <span
          className="absolute -left-6 text-sm font-sans text-gray-300 bottom-0 cursor-default"
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
        <span className="hidden">{children}</span>
      </span>
    )
  }

  if (leaf.h1) {
    return (
      <span className="h1" {...attributes}>
        {children}
      </span>
    )
  }

  if (leaf.h2) {
    return (
      <span className="h2" {...attributes}>
        {children}
      </span>
    )
  }

  if (leaf.h3) {
    return (
      <span className="h3" {...attributes}>
        {children}
      </span>
    )
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
          className="mr-2 text-red-450 font-bold select-none"
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
