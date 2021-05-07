import { Note } from '@prisma/client'
import axios from 'axios'
import { FC, useEffect, useMemo, useState } from 'react'
import { AddOutline, SearchOutline, TrashOutline } from 'react-ionicons'
import { useRecoilState } from 'recoil'
import { curNoteIdState, noteStore } from '../../store/notes'

export interface NotePreviewProps {
  note: Note
  selectNote: () => void
  deleteNote: () => Promise<void>
}

const NotePreview: FC<NotePreviewProps> = ({
  note,
  selectNote,
  deleteNote,
}) => {
  const isEmptyNote = note.content === ''
  const title = note.title || 'Untitled'

  const handleDeleteNote = async () => {
    if (window.confirm(`Are you sure you want to delete note? ${note.title}`)) {
      await deleteNote()
    }
  }

  return (
    <div className="grid w-full" style={{ gridTemplateColumns: '1fr auto' }}>
      <div
        className="border-b border-gray-200 p-2 pl-0 ml-5 h-20"
        onClick={selectNote}
      >
        <div className="mb-1 text-gray-700 w-56">
          {isEmptyNote && <div>New note</div>}
          {!isEmptyNote && <div className="truncate w-full">{title}</div>}
        </div>
        <div className="text-gray-400 text-sm font-light">
          {isEmptyNote && <div>Write something down</div>}
          {!isEmptyNote && (
            <div className="text-gray-400 block">
              {note.content
                .slice(0, 240)
                .replace(/^#\s+(.+?)\s*(\n|$)/, '')
                .replace(/#{1,3}\s+/g, '')
                .replace(/\.\s*\n/g, '. ')
                .replace(/\n/g, '. ')
                .slice(0, 64)
                .replace(/(\s|,|\.|;|_|-|\?|!)+?[^\s]*$/, '')}
              ...
            </div>
          )}
        </div>
      </div>
      <div className="border-b border-gray-200 hover:border-red-450 w-12">
        <div
          className="flex h-full items-center justify-center text-gray-300 hover:bg-red-450 hover:text-gray-50 transition-colors duration-100 btn-base"
          onClick={handleDeleteNote}
        >
          <TrashOutline style={{ color: 'inherit' }} width="1.2rem" />
        </div>
      </div>
    </div>
  )
}

export interface Props {
  notes: Note[]
}

const SideBar: FC<Props> = (props) => {
  const [noteIds, setNoteIds] = useState<number[]>([])
  const [curNoteId, setCurNoteId] = useRecoilState(curNoteIdState)
  const [allNotes, setAllNotes] = useRecoilState(noteStore)

  const notes = useMemo(() => {
    return noteIds.filter((id) => allNotes[id]).map((id) => allNotes[id])
  }, [noteIds, allNotes])

  const addNote = async () => {
    const res = await axios.post('/api/notes', {
      content: '',
    })

    if (res.data.success) {
      setAllNotes((val) => ({
        ...val,
        [res.data.data.id]: res.data.data,
      }))
      setNoteIds((val) => {
        return [res.data.data.id, ...val]
      })
      setCurNoteId(res.data.data.id)
    }
  }

  const deleteNote = async (noteSelect: Pick<Note, 'id'>) => {
    await axios.delete(`/api/notes/${noteSelect.id}`)
    setNoteIds((val) => {
      const newVal = val.filter((id) => id !== noteSelect.id)
      return newVal
    })
    if (curNoteId === noteSelect.id) {
      setCurNoteId(undefined)
    }
    setAllNotes((val) => {
      const clone = { ...val }
      delete clone[noteSelect.id]
      return clone
    })
  }

  useEffect(() => {
    const noteMap: Record<number, Note> = {}
    props.notes.forEach((note) => {
      noteMap[note.id] = note
    })
    setAllNotes(noteMap)
    setNoteIds(props.notes.map((note) => note.id))
    if (props.notes.length > 0) {
      setCurNoteId(props.notes[0].id)
    }
  }, [])

  return (
    <div
      className="grid grid-flow-row h-full"
      style={{ gridTemplateRows: 'auto 1fr' }}
    >
      <div className="h-12 border-b border-gray-200 flex items-center justify-evenly">
        <div className="w-9/12 h-6 rounded border border-gray-300 flex items-center justify-center text-gray-400 text-sm cursor-text">
          <SearchOutline style={{ color: 'inherit' }} width="1.1rem" />
          <div className="ml-1">Search Notes</div>
        </div>
        <button
          className="h-6 w-6 flex items-center justify-center btn-rounded btn"
          onClick={addNote}
        >
          <AddOutline style={{ color: 'inherit' }} width="1.2rem" />
        </button>
      </div>
      <div className="overflow-y-auto">
        {notes.map((note) => (
          <div key={note.id} className="relative cursor-pointer">
            {curNoteId === note.id && (
              <div className="absolute top-0 left-0 bg-red-400 w-1 h-full"></div>
            )}
            <NotePreview
              note={note}
              selectNote={() => setCurNoteId(note.id)}
              deleteNote={() => deleteNote(note)}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default SideBar
