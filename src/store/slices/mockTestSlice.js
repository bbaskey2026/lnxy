import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { mockTestService } from '../../services/mockTestService'

export const fetchMockTests = createAsyncThunk(
  'mockTests/fetchAll',
  async () => mockTestService.list(),
)

export const fetchMockTest = createAsyncThunk(
  'mockTests/fetchById',
  async (testId) => mockTestService.getById(testId),
)

const readObject = (key, fallback) => {
  try {
    return JSON.parse(sessionStorage.getItem(key) ?? 'null') ?? fallback
  } catch {
    return fallback
  }
}

const mockTestSlice = createSlice({
  name: 'mockTests',
  initialState: {
    availableTests: [],
    loading: false,
    error: null,
    selectedTestId: null,
    activeQuestionIndex: 0,
    answers: readObject('exampro.testAnswers', {}),
    reviewIds: readObject('exampro.testReviewIds', []),
    timerSeconds: 3600,
    testStatus: 'idle',
    result: null,
  },
  reducers: {
    startTest(state, action) {
      const test = state.availableTests.find((item) => item.id === action.payload)
      if (!test) return
      state.selectedTestId = test.id
      state.activeQuestionIndex = 0
      state.answers = {}
      state.reviewIds = []
      state.timerSeconds = test.durationSeconds
      state.testStatus = 'in_progress'
      state.result = null
      sessionStorage.setItem('exampro.testId', test.id)
      sessionStorage.setItem('exampro.testAnswers', '{}')
      sessionStorage.setItem('exampro.testReviewIds', '[]')
    },
    restoreTest(state, action) {
      const test = state.availableTests.find((item) => item.id === action.payload)
      if (!test) return
      const isSameAttempt = state.selectedTestId === test.id || sessionStorage.getItem('exampro.testId') === test.id
      const questionIds = new Set(test.questions.map((question) => question.id))
      if (!isSameAttempt) {
        state.answers = {}
        state.reviewIds = []
        state.timerSeconds = test.durationSeconds
        sessionStorage.setItem('exampro.testAnswers', '{}')
        sessionStorage.setItem('exampro.testReviewIds', '[]')
        sessionStorage.setItem('exampro.testTimerSeconds', JSON.stringify(test.durationSeconds))
      } else {
        state.answers = Object.fromEntries(Object.entries(state.answers).filter(([id]) => questionIds.has(id)))
        state.reviewIds = state.reviewIds.filter((id) => questionIds.has(id))
        state.timerSeconds = readObject('exampro.testTimerSeconds', test.durationSeconds)
      }
      state.selectedTestId = test.id
      state.activeQuestionIndex = 0
      state.testStatus = 'in_progress'
      state.result = null
      sessionStorage.setItem('exampro.testId', test.id)
    },
    setActiveQuestion(state, action) {
      state.activeQuestionIndex = action.payload
    },
    saveAnswer(state, action) {
      const { questionId, optionIndex } = action.payload
      state.answers[questionId] = optionIndex
      sessionStorage.setItem('exampro.testAnswers', JSON.stringify(state.answers))
    },
    clearAnswer(state, action) {
      delete state.answers[action.payload]
      sessionStorage.setItem('exampro.testAnswers', JSON.stringify(state.answers))
    },
    toggleReview(state, action) {
      const id = action.payload
      state.reviewIds = state.reviewIds.includes(id)
        ? state.reviewIds.filter((item) => item !== id)
        : [...state.reviewIds, id]
      sessionStorage.setItem('exampro.testReviewIds', JSON.stringify(state.reviewIds))
    },
    tickTimer(state) {
      state.timerSeconds = Math.max(0, state.timerSeconds - 1)
      sessionStorage.setItem('exampro.testTimerSeconds', JSON.stringify(state.timerSeconds))
    },
    submitTest(state) {
      if (state.testStatus !== 'in_progress') return
      const test = state.availableTests.find((item) => item.id === state.selectedTestId)
      if (!test) return

      let correct = 0
      let incorrect = 0
      let unattempted = 0
      test.questions.forEach((question) => {
        const selected = state.answers[question.id]
        if (selected === undefined) unattempted += 1
        else if (selected === question.correctIndex) correct += 1
        else incorrect += 1
      })

      const obtainedMarks = (correct * test.positiveMarks) - (incorrect * test.negativeMarks)
      const maxMarks = test.questions.length * test.positiveMarks
      state.result = {
        testId: test.id,
        totalMarks: maxMarks,
        obtainedMarks: Number(obtainedMarks.toFixed(2)),
        correct,
        incorrect,
        unattempted,
        accuracy: correct + incorrect === 0 ? 0 : Number(((correct / (correct + incorrect)) * 100).toFixed(1)),
        timeConsumedSeconds: test.durationSeconds - state.timerSeconds,
      }
      state.testStatus = 'submitted'
      sessionStorage.removeItem('exampro.testAnswers')
      sessionStorage.removeItem('exampro.testReviewIds')
      sessionStorage.removeItem('exampro.testTimerSeconds')
      sessionStorage.removeItem('exampro.testId')
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMockTests.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchMockTests.fulfilled, (state, action) => {
        state.loading = false
        state.availableTests = action.payload
      })
      .addCase(fetchMockTests.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      .addCase(fetchMockTest.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchMockTest.fulfilled, (state, action) => {
        state.loading = false
        const index = state.availableTests.findIndex((test) => test.id === action.payload.id)
        if (index === -1) state.availableTests.push(action.payload)
        else state.availableTests[index] = action.payload
      })
      .addCase(fetchMockTest.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
  },
})

export const {
  startTest,
  restoreTest,
  setActiveQuestion,
  saveAnswer,
  clearAnswer,
  toggleReview,
  tickTimer,
  submitTest,
} = mockTestSlice.actions
export default mockTestSlice.reducer
