import { Note } from '@prisma/client'
import { atom, selector } from 'recoil'

export const noteStore = atom<Record<number, Note>>({
  key: 'notesState',
  default: {},
})

export const notesSelector = selector<Note[]>({
  key: 'notesSelector',
  get: ({ get }) => {
    const notes = get(noteStore)

    return Object.values(notes)
  },
})

export const curNoteIdState = atom<number | null>({
  key: 'currentNoteIdState',
  default: null,
})

export const curNoteSelector = selector<Note | null>({
  key: 'curNotesSelector',
  get: ({ get }) => {
    const notes = get(noteStore)
    const curNoteId = get(curNoteIdState)

    return curNoteId && notes[curNoteId]
  },
})
