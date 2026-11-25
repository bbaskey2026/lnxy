import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { axiosClient } from '../../api/axiosClient'
import { platformService } from '../../services/platformService'

export const fetchPreviousPapers = createAsyncThunk('previousPapers/fetchPreviousPapers', async () => {
  const [papers, examsResponse] = await Promise.all([
    platformService.listPreviousPapers(),
    axiosClient.get('/exams'),
  ])
  const exams = new Map(examsResponse.data.data.map((exam) => [exam.id, exam.name]))
  return papers.map((paper) => ({
    ...paper,
    examination: exams.get(paper.examId) ?? paper.examination ?? '',
    title: paper.title ?? paper.name ?? '',
    year: paper.year === undefined ? null : Number(paper.year),
    questions: paper.questionCount ?? paper.questions ?? 0,
    size: paper.fileSize ?? paper.size ?? '',
  }))
})

const previousPaperSlice = createSlice({
  name: 'previousPapers',
  initialState: { items: [], loading: false, error: null },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPreviousPapers.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchPreviousPapers.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchPreviousPapers.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
  },
})

export default previousPaperSlice.reducer
