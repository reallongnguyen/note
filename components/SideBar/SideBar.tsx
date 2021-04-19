import { Note } from '@prisma/client'
import axios from 'axios'
import { FC, useEffect, useMemo, useState } from 'react'
import { AddOutline, SearchOutline } from 'react-ionicons'
import { useRecoilState } from 'recoil'
import { curNoteIdState, notesState } from '../../store/notes'

export interface NotePreviewProps {
  note: Note
}

const NotePreview: FC<NotePreviewProps> = ({ note }) => {
  const isEmptyNote = note.content === ''
  const title = note.title || 'Untitled'

  return (
    <div className="grid grid-flow-col grid-cols-12">
      <div className="col-span-2 text-gray-400 pl-3 pt-2">2M</div>
      <div className="col-span-10 col-start-3 border-b border-gray-200 pt-2 pr-2 pb-3">
        <div className="mb-1 text-gray-700 truncate w-full">
          {isEmptyNote && <div>New note</div>}
          {!isEmptyNote && <div>{title}</div>}
        </div>
        <div className="text-gray-400 text-sm">
          {isEmptyNote && <div className="">You just need some words</div>}
          {!isEmptyNote && (
            <div className="text-gray-400">
              {note.content
                .slice(0, 240)
                .replace(/^#\s+(.+?)\s*\n/, '')
                .replace(/#{1,3}\s+/g, '')
                .replace(/\.\s*\n/g, '. ')
                .replace(/\n/g, '. ')
                .slice(0, 72)
                .replace(/(\s|,|\.|;|_|-|\?|!)+?[^\s]*$/, '')}
              ...
            </div>
          )}
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
  const [allNotes, setAllNotes] = useRecoilState(notesState)

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
    <div className="grid grid-flow-row">
      <div className="auto-rows-auto h-12 border-b border-gray-200 flex items-center justify-evenly">
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
      <div className="overflow-y-auto auto-rows-fr">
        {notes.map((note) => (
          <div
            key={note.id}
            onClick={() => setCurNoteId(note.id)}
            className="relative cursor-pointer"
          >
            {curNoteId === note.id && (
              <div className="absolute top-0 left-0 bg-red-400 w-1 h-full"></div>
            )}
            <NotePreview note={note} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default SideBar
