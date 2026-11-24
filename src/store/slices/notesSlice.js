import { createSlice } from '@reduxjs/toolkit'

const readNotes = () => {
  try {
    return JSON.parse(localStorage.getItem('exampro.notes') ?? '[]')
  } catch {
    return []
  }
}

const notesSlice = createSlice({
  name: 'notes',
  initialState: { items: readNotes() },
  reducers: {
    saveNote(state, action) {
      const note = action.payload
      const existing = state.items.find((item) => item.id === note.id)
      if (existing) Object.assign(existing, note)
      else state.items.unshift(note)
      localStorage.setItem('exampro.notes', JSON.stringify(state.items))
    },
    deleteNote(state, action) {
      state.items = state.items.filter((item) => item.id !== action.payload)
      localStorage.setItem('exampro.notes', JSON.stringify(state.items))
    },
  },
})

export const { saveNote, deleteNote } = notesSlice.actions
export default notesSlice.reducer
