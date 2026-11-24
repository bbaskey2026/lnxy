import { createSlice } from '@reduxjs/toolkit'

export const mockTests = [
  {
    id: 'ssc-cgl-tier-1-mock-1',
    title: 'SSC CGL Tier I - Full Mock 01',
    category: 'Full-length',
    examination: 'SSC CGL',
    durationSeconds: 3600,
    positiveMarks: 2,
    negativeMarks: 0.5,
    attempted: 0,
    questions: [
      {
        id: 'q1',
        subject: 'Quantitative Aptitude',
        text: 'A and B together can complete a work in 12 days. A alone can complete it in 20 days. In how many days can B alone complete it?',
        options: ['25 days', '30 days', '35 days', '40 days'],
        correctIndex: 1,
        explanation: 'Let B take x days. 1/20 + 1/x = 1/12. Solving gives 1/x = 1/30, so B takes 30 days.',
      },
      {
        id: 'q2',
        subject: 'Reasoning',
        text: 'Find the odd one out.',
        options: ['Square', 'Rectangle', 'Triangle', 'Cube'],
        correctIndex: 3,
        explanation: 'Square, rectangle and triangle are two-dimensional figures, while cube is three-dimensional.',
      },
      {
        id: 'q3',
        subject: 'English',
        text: 'Choose the word closest in meaning to "Meticulous".',
        options: ['Careless', 'Precise', 'Rapid', 'Ordinary'],
        correctIndex: 1,
        explanation: 'Meticulous means showing great attention to detail, making "precise" the closest meaning.',
      },
      {
        id: 'q4',
        subject: 'General Studies',
        text: 'Which Article of the Indian Constitution deals with the abolition of untouchability?',
        options: ['Article 14', 'Article 17', 'Article 21', 'Article 32'],
        correctIndex: 1,
        explanation: 'Article 17 abolishes untouchability and forbids its practice in any form.',
      },
      {
        id: 'q5',
        subject: 'Quantitative Aptitude',
        text: 'A shopkeeper marks an article 25% above cost price and allows a 10% discount. What is the profit percentage?',
        options: ['12.5%', '15%', '17.5%', '20%'],
        correctIndex: 0,
        explanation: 'Let cost be 100. Marked price is 125 and selling price is 112.5, resulting in 12.5% profit.',
      },
      {
        id: 'q6',
        subject: 'Reasoning',
        text: 'If FLOWER is written as 612753, then what could be the code for WOLF?',
        options: ['3526', '3625', '2563', '6253'],
        correctIndex: 2,
        explanation: 'This uses the letter-position mapping established by the given sample code; the resulting sequence for WOLF is 2563.',
      },
    ],
  },
  {
    id: 'odisha-ri-sectional',
    title: 'OSSSC RI - Arithmetic Sectional',
    category: 'Sectional',
    examination: 'OSSSC RI',
    durationSeconds: 1800,
    positiveMarks: 1,
    negativeMarks: 0.25,
    attempted: 1240,
    questions: [
      {
        id: 'o1',
        subject: 'Arithmetic',
        text: 'The average of five consecutive even numbers is 28. What is the largest number?',
        options: ['30', '32', '34', '36'],
        correctIndex: 1,
        explanation: 'The middle number is 28. The numbers are 24, 26, 28, 30 and 32, so the largest is 32.',
      },
      {
        id: 'o2',
        subject: 'Arithmetic',
        text: 'A sum doubles itself in 10 years at simple interest. What is the rate?',
        options: ['8%', '10%', '12%', '15%'],
        correctIndex: 1,
        explanation: 'For doubling, interest equals principal. R = 100/P years = 100/10 = 10%.',
      },
    ],
  },
]

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
    availableTests: mockTests,
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
      sessionStorage.setItem('exampro.testAnswers', '{}')
      sessionStorage.setItem('exampro.testReviewIds', '[]')
    },
    restoreTest(state, action) {
      const test = state.availableTests.find((item) => item.id === action.payload)
      if (!test) return
      state.selectedTestId = test.id
      state.testStatus = 'in_progress'
      state.timerSeconds = readObject('exampro.testTimerSeconds', test.durationSeconds)
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
    },
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
