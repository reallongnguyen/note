/* eslint-disable no-console */
import { CheckboxOutline, LinkOutline, SquareOutline } from 'react-ionicons'
import { RenderLeafProps } from 'slate-react'
import { CustomText } from './customType'

type CustomFunc = Record<string, (l: CustomText) => () => void>

const Leaf = ({
  attributes,
  children,
  leaf,
  changeURL,
  changeHeading,
  changeTaskStatus,
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
        ref={(ref) => {
          if (!ref) {
            return
          }
          ref.parentNode.parentElement.className = 'heading'
        }}
        className="hidden float-left"
        {...attributes}
      >
        {children}
      </span>
    )
  }

  if (leaf.h1) {
    return (
      <h1 {...attributes} className="relative">
        <span
          className="absolute -left-6 bottom-0 cursor-pointer h1-btn"
          onClick={changeHeading(leaf)}
          contentEditable={false}
        />
        {children}
      </h1>
    )
  }

  if (leaf.h2) {
    return (
      <h2 {...attributes} className="relative">
        <span
          className="absolute -left-6 bottom-0 cursor-pointer h2-btn"
          onClick={changeHeading(leaf)}
          contentEditable={false}
        />
        {children}
      </h2>
    )
  }

  if (leaf.h3) {
    return (
      <h3 {...attributes} className="relative">
        <span
          className="absolute -left-6 bottom-0 cursor-pointer h3-btn"
          onClick={changeHeading(leaf)}
          contentEditable={false}
        />
        {children}
      </h3>
    )
  }

  if (leaf.hr) {
    return (
      <span
        ref={(ref) => {
          if (!ref) {
            return
          }
          ref.parentNode.parentElement.className = 'hr'
        }}
        className="text-center"
        {...attributes}
      >
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
      <span
        ref={(ref) => {
          if (!ref) {
            return
          }
          ref.parentNode.parentElement.className = 'blockquote paragraph'
        }}
        className="hidden"
        {...attributes}
      >
        {children}
      </span>
    )
  }

  if (leaf.blockquote) {
    return <span {...attributes}>{children}</span>
  }

  if (leaf.list && leaf.punctuation) {
    return (
      <span className="li" {...attributes}>
        <span className="hidden">{children}</span>
      </span>
    )
  }

  if (leaf.list) {
    return (
      <span
        ref={(ref) => {
          if (!ref) {
            return
          }
          ref.parentNode.parentElement.className = 'list'
        }}
        {...attributes}
      >
        {children}
      </span>
    )
  }

  if (leaf.task && leaf.punctuation) {
    const isDone = leaf.text.startsWith('[x]')

    return (
      <span
        ref={(ref) => {
          if (!ref) {
            return
          }
          ref.parentNode.parentElement.className = 'list'
        }}
        {...attributes}
      >
        <span className="hidden">{children}</span>
        <span
          className={`
            pr-2 mt-[0.4rem] font-bold select-none cursor-pointer
            ${
              isDone
                ? 'text-green-500 hover:text-green-600'
                : 'text-gray-400 hover:text-gray-500'
            }
          `}
          contentEditable={false}
          onClick={changeTaskStatus(leaf)}
        >
          {isDone && (
            <CheckboxOutline
              style={{ color: 'inherit' }}
              width="1.2rem"
              cssClasses="-mt-1 inline"
            />
          )}
          {!isDone && (
            <SquareOutline
              style={{ color: 'inherit' }}
              width="1.2rem"
              cssClasses="-mt-1 inline"
            />
          )}
        </span>
      </span>
    )
  }

  return (
    <span
      ref={(ref) => {
        if (!ref) {
          return
        }
        if (!ref.parentNode.parentElement.className) {
          ref.parentNode.parentElement.className = 'paragraph'
        }
      }}
      {...attributes}
    >
      {children}
    </span>
  )
}

export default Leaf
