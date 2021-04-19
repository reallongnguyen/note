import { Note } from '@prisma/client'
import { atom, selector } from 'recoil'

export const notesState = atom<Record<number, Note>>({
  key: 'notesState',
  default: {},
})

export const notesSelector = selector<Note[]>({
  key: 'notesSelector',
  get: ({ get }) => {
    const notes = get(notesState)

    return Object.values(notes)
  },
})

export const curNoteIdState = atom<number | null>({
  key: 'currentNoteIdState',
  default: null,
})

export const curNoteSelector = selector<Note | null>({
  key: 'notesSelector',
  get: ({ get }) => {
    const notes = get(notesState)
    const curNoteId = get(curNoteIdState)

    return curNoteId && notes[curNoteId]
  },
})
