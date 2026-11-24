import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

export const fetchStudyMaterials = createAsyncThunk('studyMaterials/fetchStudyMaterials', async () => {
  await new Promise((resolve) => setTimeout(resolve, 280))
  return [
    { id: 'qa-formulas', title: 'Quantitative Aptitude Formula Book', category: 'Formula Sheets', examination: 'SSC CGL', subject: 'Quantitative Aptitude', topic: 'Arithmetic', format: 'PDF', pages: 48, size: '3.2 MB', popularity: 98, createdAt: '2026-11-20', downloaded: false, description: 'Essential formulas, shortcuts and solved examples for arithmetic and data interpretation.' },
    { id: 'polity-notes', title: 'Indian Polity - Fundamental Rights', category: 'Subject-wise Notes', examination: 'UPSC', subject: 'Indian Polity', topic: 'Fundamental Rights', format: 'PDF', pages: 36, size: '2.8 MB', popularity: 94, createdAt: '2026-11-18', downloaded: false, description: 'Concept notes covering Articles 12-35, restrictions and important constitutional cases.' },
    { id: 'odisha-gk', title: 'Odisha General Knowledge 2026', category: 'Handwritten Notes', examination: 'OSSSC RI', subject: 'General Studies', topic: 'Odisha GK', format: 'PDF', pages: 62, size: '5.1 MB', popularity: 91, createdAt: '2026-11-15', downloaded: true, description: 'Updated notes on Odisha history, geography, economy, culture and administration.' },
    { id: 'reasoning-tricks', title: 'Reasoning Short Tricks', category: 'Short Tricks', examination: 'Banking', subject: 'Reasoning', topic: 'Puzzles', format: 'PDF', pages: 24, size: '1.9 MB', popularity: 89, createdAt: '2026-11-12', downloaded: false, description: 'Fast approaches for puzzles, arrangements, syllogisms and input-output problems.' },
    { id: 'current-affairs-oct', title: 'October 2026 Current Affairs', category: 'Current Affairs PDFs', examination: 'All Examinations', subject: 'Current Affairs', topic: 'Monthly Current Affairs', format: 'PDF', pages: 74, size: '6.4 MB', popularity: 97, createdAt: '2026-11-01', downloaded: true, description: 'National, international, economic and sports events with exam-oriented questions.' },
    { id: 'english-revision', title: 'English Language Revision Pack', category: 'Revision Materials', examination: 'SSC CHSL', subject: 'English', topic: 'Grammar', format: 'PDF', pages: 41, size: '2.6 MB', popularity: 86, createdAt: '2026-10-28', downloaded: false, description: 'Grammar rules, common errors, vocabulary and quick revision exercises.' },
    { id: 'previous-ssc-cgl', title: 'SSC CGL Previous Year Papers', category: 'Previous Year Papers', examination: 'SSC CGL', subject: 'Mixed', topic: 'Previous Papers', format: 'ZIP', pages: 320, size: '18.7 MB', popularity: 99, createdAt: '2026-10-22', downloaded: false, description: 'A collection of previous year papers from 2022 to 2025 with solution references.' },
    { id: 'data-interpretaion', title: 'Data Interpretation Practice Notes', category: 'Topic-wise Notes', examination: 'Banking', subject: 'Quantitative Aptitude', topic: 'Data Interpretation', format: 'PDF', pages: 33, size: '3.8 MB', popularity: 88, createdAt: '2026-10-18', downloaded: false, description: 'Tables, charts, caselets and calculation techniques with practice questions.' },
  ]
})

const readList = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key) ?? '[]')
  } catch {
    return []
  }
}

const studyMaterialSlice = createSlice({
  name: 'studyMaterials',
  initialState: {
    items: [],
    loading: false,
    error: null,
    bookmarkIds: readList('exampro.materialBookmarks'),
    downloadedIds: readList('exampro.materialDownloads'),
  },
  reducers: {
    toggleBookmark(state, action) {
      const id = action.payload
      state.bookmarkIds = state.bookmarkIds.includes(id)
        ? state.bookmarkIds.filter((item) => item !== id)
        : [...state.bookmarkIds, id]
      localStorage.setItem('exampro.materialBookmarks', JSON.stringify(state.bookmarkIds))
    },
    markDownloaded(state, action) {
      const id = action.payload
      if (!state.downloadedIds.includes(id)) state.downloadedIds.push(id)
      localStorage.setItem('exampro.materialDownloads', JSON.stringify(state.downloadedIds))
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudyMaterials.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchStudyMaterials.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchStudyMaterials.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
  },
})

export const { toggleBookmark, markDownloaded } = studyMaterialSlice.actions
export default studyMaterialSlice.reducer
