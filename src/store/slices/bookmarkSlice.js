import { createSlice } from '@reduxjs/toolkit'

const readList = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key) ?? '[]')
  } catch {
    return []
  }
}

const bookmarkSlice = createSlice({
  name: 'bookmarks',
  initialState: {
    items: readList('exampro.bookmarks'),
  },
  reducers: {
    toggleBookmark(state, action) {
      const item = action.payload
      const existing = state.items.find((entry) => entry.id === item.id && entry.type === item.type)
      state.items = existing
        ? state.items.filter((entry) => !(entry.id === item.id && entry.type === item.type))
        : [item, ...state.items]
      localStorage.setItem('exampro.bookmarks', JSON.stringify(state.items))
    },
  },
})

export const { toggleBookmark } = bookmarkSlice.actions
export default bookmarkSlice.reducer
