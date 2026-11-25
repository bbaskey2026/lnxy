import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { platformService } from '../../services/platformService'

const readStoredValue = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key) ?? 'null') ?? fallback
  } catch {
    return fallback
  }
}

const formatDuration = (seconds = 0) => {
  const minutes = Math.floor(seconds / 60)
  return `${minutes}:${String(seconds % 60).padStart(2, '0')}`
}

export const fetchLectures = createAsyncThunk(
  'lectures/fetchLectures',
  () => platformService.listLectures(),
)

const lectureSlice = createSlice({
  name: 'lectures',
  initialState: {
    items: [],
    selectedLectureId: null,
    notes: readStoredValue('exampro.lectureNotes', {}),
    loading: false,
    error: null,
  },
  reducers: {
    selectLecture(state, action) {
      state.selectedLectureId = action.payload
    },
    updateProgress(state, action) {
      const { lectureId, seconds } = action.payload
      const lecture = state.items.find((item) => item.id === lectureId)
      if (lecture) lecture.seconds = seconds
      const progress = readStoredValue('exampro.lectureProgress', {})
      progress[lectureId] = seconds
      localStorage.setItem('exampro.lectureProgress', JSON.stringify(progress))
    },
    toggleCompleted(state, action) {
      const lecture = state.items.find((item) => item.id === action.payload)
      if (!lecture) return
      lecture.completed = !lecture.completed
      const completedIds = readStoredValue('exampro.completedLectures', [])
      const nextIds = lecture.completed
        ? [...new Set([...completedIds, lecture.id])]
        : completedIds.filter((id) => id !== lecture.id)
      localStorage.setItem('exampro.completedLectures', JSON.stringify(nextIds))
    },
    toggleLectureBookmark(state, action) {
      const lecture = state.items.find((item) => item.id === action.payload)
      if (!lecture) return
      lecture.bookmark = !lecture.bookmark
      const bookmarkIds = readStoredValue('exampro.lectureBookmarks', [])
      const nextIds = lecture.bookmark
        ? [...new Set([...bookmarkIds, lecture.id])]
        : bookmarkIds.filter((id) => id !== lecture.id)
      localStorage.setItem('exampro.lectureBookmarks', JSON.stringify(nextIds))
    },
    saveLectureNote(state, action) {
      const { lectureId, note } = action.payload
      state.notes[lectureId] = note
      localStorage.setItem('exampro.lectureNotes', JSON.stringify(state.notes))
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLectures.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchLectures.fulfilled, (state, action) => {
        state.loading = false
        localStorage.removeItem('exampro.lectures')
        const progress = readStoredValue('exampro.lectureProgress', {})
        const completedIds = readStoredValue('exampro.completedLectures', [])
        const bookmarkIds = readStoredValue('exampro.lectureBookmarks', [])
        state.items = action.payload
          .slice()
          .sort((left, right) => (left.sortOrder ?? 0) - (right.sortOrder ?? 0))
          .map((lecture) => ({
            ...lecture,
            module: lecture.moduleName ?? (lecture.moduleId ? `Module ${lecture.moduleId}` : 'Course content'),
            duration: formatDuration(lecture.durationSeconds),
            seconds: progress[lecture.id] ?? 0,
            completed: completedIds.includes(lecture.id),
            bookmark: bookmarkIds.includes(lecture.id),
          }))
        if (!state.items.some((lecture) => lecture.id === state.selectedLectureId)) {
          state.selectedLectureId = state.items[0]?.id ?? null
        }
      })
      .addCase(fetchLectures.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
  },
})

export const {
  selectLecture,
  updateProgress,
  toggleCompleted,
  toggleLectureBookmark,
  saveLectureNote,
} = lectureSlice.actions
export default lectureSlice.reducer
