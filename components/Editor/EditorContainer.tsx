import axios from 'axios'
import { FC } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import Image from 'next/image'
import { curNoteSelector, noteStore } from '../../store/notes'
import MarkdownPreview from './MarkdownPreview'

const EditorContainer: FC = () => {
  const curNote = useRecoilValue(curNoteSelector)
  const [allNotes, setNoteStore] = useRecoilState(noteStore)

  const noteCount = Object.keys(allNotes).length

  const updateNote = async (content: string) => {
    if (!curNote) {
      return
    }

    const res = await axios.patch(`/api/notes/${curNote.id}`, {
      content,
    })

    if (res.data.success) {
      setNoteStore((val) => ({
        ...val,
        [res.data.data.id]: res.data.data,
      }))
    }
  }

  return (
    <>
      {!curNote && (
        <div className="flex flex-col items-center justify-center w-full h-full">
          <div className="opacity-20">
            <Image src="/images/qiqi-confused.png" width="320" height="320" />
          </div>
          <div className="text-gray-400 mt-6">
            {noteCount} {noteCount < 2 ? 'note' : 'notes'}
          </div>
        </div>
      )}
      {curNote && (
        <MarkdownPreview
          initialContent={curNote.content}
          update={updateNote}
          contentId={curNote.id}
        />
      )}
    </>
  )
}

export default EditorContainer
