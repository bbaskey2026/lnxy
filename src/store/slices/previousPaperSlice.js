import { createSlice } from '@reduxjs/toolkit'

export const previousPapers = [
  { id: 'ssc-cgl-2025', examination: 'SSC CGL', year: 2025, subject: 'Mixed', title: 'SSC CGL 2025 Tier I', questions: 100, size: '4.8 MB' },
  { id: 'ssc-cgl-2024', examination: 'SSC CGL', year: 2024, subject: 'Quantitative Aptitude', title: 'SSC CGL 2024 Quantitative Aptitude', questions: 25, size: '2.1 MB' },
  { id: 'osssc-ri-2025', examination: 'OSSSC RI', year: 2025, subject: 'Mixed', title: 'OSSSC RI Preliminary 2025', questions: 100, size: '3.7 MB' },
  { id: 'ibps-po-2024', examination: 'IBPS PO', year: 2024, subject: 'Reasoning', title: 'IBPS PO 2024 Reasoning', questions: 35, size: '2.6 MB' },
  { id: 'upsc-prelims-2024', examination: 'UPSC', year: 2024, subject: 'General Studies', title: 'UPSC Prelims 2024 GS Paper I', questions: 100, size: '5.2 MB' },
]

const previousPaperSlice = createSlice({
  name: 'previousPapers',
  initialState: { items: previousPapers, downloadedIds: [] },
  reducers: {
    markPaperDownloaded(state, action) {
      if (!state.downloadedIds.includes(action.payload)) state.downloadedIds.push(action.payload)
    },
  },
})

export const { markPaperDownloaded } = previousPaperSlice.actions
export default previousPaperSlice.reducer
