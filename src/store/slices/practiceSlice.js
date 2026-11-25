import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { axiosClient } from '../../api/axiosClient'
import { platformService } from '../../services/platformService'

export const fetchPracticeQuestions = createAsyncThunk('practice/fetchQuestions', async () => {
  const [questions, examsResponse, subjectsResponse, topicsResponse] = await Promise.all([
    platformService.listQuestions(),
    axiosClient.get('/exams'),
    axiosClient.get('/subjects'),
    axiosClient.get('/topics'),
  ])
  const exams = new Map(examsResponse.data.data.map((exam) => [exam.id, exam.name]))
  const subjects = new Map(subjectsResponse.data.data.map((subject) => [subject.id, subject.name]))
  const topics = new Map(topicsResponse.data.data.map((topic) => [topic.id, topic.name]))

  return questions.map((question) => ({
    ...question,
    examination: exams.get(question.examId) ?? question.examination ?? '',
    subject: subjects.get(question.subjectId) ?? question.subject ?? '',
    chapter: topics.get(question.topicId) ?? question.chapter ?? '',
    correctIndex: question.correctOptionIndex,
    previousYear: question.isPreviousYear,
  }))
})

const readObject = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key) ?? 'null') ?? fallback
  } catch {
    return fallback
  }
}

const practiceSlice = createSlice({
  name: 'practice',
  initialState: {
    questions: [],
    activeIndex: 0,
    answers: readObject('exampro.practiceAnswers', {}),
    history: readObject('exampro.practiceHistory', []),
    mode: 'instant',
    loading: false,
    error: null,
  },
  reducers: {
    setPracticeMode(state, action) {
      state.mode = action.payload
    },
    setPracticeIndex(state, action) {
      state.activeIndex = action.payload
    },
    answerPractice(state, action) {
      const { questionId, optionIndex } = action.payload
      const question = state.questions.find((item) => item.id === questionId)
      if (!question) return
      state.answers[questionId] = optionIndex
      const isCorrect = optionIndex === question.correctIndex
      const previous = state.history.filter((item) => item.questionId !== questionId)
      state.history = [...previous, { questionId, correct: isCorrect, answeredAt: new Date().toISOString() }]
      localStorage.setItem('exampro.practiceAnswers', JSON.stringify(state.answers))
      localStorage.setItem('exampro.practiceHistory', JSON.stringify(state.history))
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPracticeQuestions.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchPracticeQuestions.fulfilled, (state, action) => {
        state.loading = false
        state.questions = action.payload
        const validIds = new Set(action.payload.map((item) => item.id))
        state.answers = Object.fromEntries(Object.entries(state.answers).filter(([id]) => validIds.has(id)))
        state.history = state.history.filter((item) => validIds.has(item.questionId))
        localStorage.setItem('exampro.practiceAnswers', JSON.stringify(state.answers))
        localStorage.setItem('exampro.practiceHistory', JSON.stringify(state.history))
      })
      .addCase(fetchPracticeQuestions.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
  },
})

export const { setPracticeMode, setPracticeIndex, answerPractice } = practiceSlice.actions
export default practiceSlice.reducer
