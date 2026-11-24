import { createSlice } from '@reduxjs/toolkit'

const readObject = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key) ?? 'null') ?? fallback
  } catch {
    return fallback
  }
}

const initialLectures = [
  { id: 'lesson-1', module: 'Quantitative Aptitude', title: 'Introduction to Time & Work', duration: '42:18', seconds: 728, completed: false, bookmark: false },
  { id: 'lesson-2', module: 'Quantitative Aptitude', title: 'Basic Work and Efficiency', duration: '38:45', seconds: 2325, completed: true, bookmark: true },
  { id: 'lesson-3', module: 'Quantitative Aptitude', title: 'Combined Work Problems', duration: '46:12', seconds: 0, completed: false, bookmark: false },
  { id: 'lesson-4', module: 'Reasoning Ability', title: 'Syllogism Fundamentals', duration: '34:30', seconds: 0, completed: false, bookmark: false },
  { id: 'lesson-5', module: 'Reasoning Ability', title: 'Logical Deduction', duration: '41:05', seconds: 0, completed: false, bookmark: false },
]

const lectureSlice = createSlice({
  name: 'lectures',
  initialState: {
    items: readObject('exampro.lectures', initialLectures),
    selectedLectureId: 'lesson-1',
    notes: readObject('exampro.lectureNotes', {}),
  },
  reducers: {
    selectLecture(state, action) {
      state.selectedLectureId = action.payload
    },
    updateProgress(state, action) {
      const { lectureId, seconds } = action.payload
      const lecture = state.items.find((item) => item.id === lectureId)
      if (lecture) lecture.seconds = seconds
      localStorage.setItem('exampro.lectures', JSON.stringify(state.items))
    },
    toggleCompleted(state, action) {
      const lecture = state.items.find((item) => item.id === action.payload)
      if (lecture) lecture.completed = !lecture.completed
      localStorage.setItem('exampro.lectures', JSON.stringify(state.items))
    },
    toggleLectureBookmark(state, action) {
      const lecture = state.items.find((item) => item.id === action.payload)
      if (lecture) lecture.bookmark = !lecture.bookmark
      localStorage.setItem('exampro.lectures', JSON.stringify(state.items))
    },
    saveLectureNote(state, action) {
      const { lectureId, note } = action.payload
      state.notes[lectureId] = note
      localStorage.setItem('exampro.lectureNotes', JSON.stringify(state.notes))
    },
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
