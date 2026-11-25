import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { axiosClient } from '../../api/axiosClient'
import { platformService } from '../../services/platformService'

export const fetchStudyMaterials = createAsyncThunk('studyMaterials/fetchStudyMaterials', async () => {
  const [materials, examsResponse, subjectsResponse, topicsResponse] = await Promise.all([
    platformService.listStudyMaterials(),
    axiosClient.get('/exams'),
    axiosClient.get('/subjects'),
    axiosClient.get('/topics'),
  ])
  const exams = examsResponse.data.data
  const subjects = subjectsResponse.data.data
  const topics = topicsResponse.data.data
  const examNames = new Map(exams.map((exam) => [exam.id, exam.name]))
  const subjectNames = new Map(subjects.map((subject) => [subject.id, subject.name]))
  const topicNames = new Map(topics.map((topic) => [topic.id, topic.name]))

  return materials.filter((material) => material.isPublished !== false).map((material) => ({
    ...material,
    examination: examNames.get(material.examId) ?? '',
    subject: subjectNames.get(material.subjectId) ?? '',
    topic: topicNames.get(material.topicId) ?? '',
    pages: material.pageCount ?? 0,
    size: material.fileSize ?? '',
    popularity: material.popularityScore ?? 0,
  }))
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
    loaded: false,
    error: null,
    bookmarkIds: readList('exampro.materialBookmarks'),
  },
  reducers: {
    toggleBookmark(state, action) {
      const id = action.payload
      state.bookmarkIds = state.bookmarkIds.includes(id)
        ? state.bookmarkIds.filter((item) => item !== id)
        : [...state.bookmarkIds, id]
      localStorage.setItem('exampro.materialBookmarks', JSON.stringify(state.bookmarkIds))
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
        state.loaded = true
        state.items = action.payload
        const validIds = new Set(action.payload.map((item) => item.id))
        state.bookmarkIds = state.bookmarkIds.filter((id) => validIds.has(id))
        localStorage.setItem('exampro.materialBookmarks', JSON.stringify(state.bookmarkIds))
        localStorage.removeItem('exampro.materialDownloads')
      })
      .addCase(fetchStudyMaterials.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
  },
})

export const { toggleBookmark } = studyMaterialSlice.actions
export default studyMaterialSlice.reducer
