import axios from 'axios'
import { FC } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { curNoteSelector, notesState } from '../../store/notes'
import MarkdownPreview from './MarkdownPreview'

const EditorContainer: FC = () => {
  const curNote = useRecoilValue(curNoteSelector)
  const setNoteStore = useSetRecoilState(notesState)

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
      {!curNote && <div className="">Bear here</div>}
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
