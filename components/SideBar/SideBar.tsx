import { Note } from '@prisma/client'
import axios from 'axios'
import {
  FC,
  useEffect,
  useMemo,
  useState,
  ChangeEventHandler,
  useRef,
  MouseEventHandler,
} from 'react'
import {
  AddOutline,
  SearchOutline,
  TrashOutline,
  CloseOutline,
} from 'react-ionicons'
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
    <div className="grid" style={{ gridTemplateColumns: '1fr auto' }}>
      <div
        className="p-2 pl-0 ml-5 h-20 border-b border-gray-200"
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
      <div className="w-10 right-0 top-0 h-full flex justify-center items-center">
        <div
          className="flex h-full w-full items-center justify-center bg-gray-50 bg-opacity-80 text-gray-300 hover:bg-red-450 hover:text-gray-50 border-b border-gray-200 hover:border-red-450 transition-colors duration-75 btn-base"
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
  const [deleteButtonState, setDeleteButtonState] = useState<string>('hidden')
  const [keyword, setKeyword] = useState<string>('')
  const timeout = useRef<NodeJS.Timeout>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

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

  const handleSearch = () => {
    setDeleteButtonState('')
  }

  const handleSelectSearchWrapper = () => {
    if (searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }

  const blurSearch = () => {
    setDeleteButtonState('hidden')
    // update note lists
  }

  const deleteKey: MouseEventHandler = (e) => {
    e.preventDefault()
    setKeyword('')
    // update note lists
    setDeleteButtonState('hidden')
  }

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setKeyword(e.target.value)
  }

  useEffect(() => {
    clearTimeout(timeout.current)

    const fetchNotesAPI = keyword
      ? `/api/notes/search/${keyword}`
      : '/api/notes'
    const fetchManyNotes = async (url: string) => {
      const res = await axios.get(url)
      const ids = res.data.data.items.map((n: Note) => n.id)
      setNoteIds(ids)
      setAllNotes((noteStore) => {
        const clone = { ...noteStore }
        res.data.data.items.forEach((n: Note) => {
          clone[n.id] = n
        })

        return clone
      })
    }

    // fetch all notes
    if (!keyword) {
      fetchManyNotes(fetchNotesAPI)
      return
    }

    // fetch notes relate keyword
    timeout.current = setTimeout(async () => {
      fetchManyNotes(fetchNotesAPI)
    }, 400)
  }, [keyword])

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
      <div className="h-12 border-b flex items-center justify-evenly">
        <div
          className="w-9/12 h-6 px-2 rounded border border-gray-300 flex items-center justify-center text-gray-400 text-sm cursor-text relative"
          onFocus={handleSearch}
          onBlur={blurSearch}
          onClick={handleSelectSearchWrapper}
        >
          <div
            className={`
            h-full w-full flex items-center transition-all duration-500 ease-out focus-within:pl-0
            ${keyword ? 'pl-0' : 'p-l-haft'}
          `}
          >
            <SearchOutline
              cssClasses="mr-2"
              style={{ color: 'inherit' }}
              width="1.1rem"
            />
            <input
              ref={searchInputRef}
              className="flex-grow text-left outline-none bg-transparent"
              type="text"
              id="search-input"
              placeholder="Search Notes"
              value={keyword}
              onChange={handleChange}
            />
            <button
              onClick={deleteKey}
              className="text-gray-400 right-1 absolute outline-none focus:outline-none active:outline-none"
            >
              {keyword && (
                <CloseOutline
                  color="rgb(156, 163, 175)"
                  cssClasses={`cursor-pointer ${deleteButtonState}`}
                  style={{ color: 'inherit' }}
                  width="1.1rem"
                />
              )}
            </button>
          </div>
        </div>
        <button
          className="h-6 w-6 flex items-center justify-center btn-rounded btn"
          onClick={addNote}
        >
          <AddOutline style={{ color: 'inherit' }} width="1.1rem" />
        </button>
      </div>
      <div className="overflow-y-auto">
        {notes.map((note) => (
          <div key={note.id} className="relative cursor-pointer">
            {curNoteId === note.id && (
              <div className="absolute top-0 left-0 bg-red-400 w-1 rounded h-full"></div>
            )}
            <NotePreview
              key={note.id}
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
