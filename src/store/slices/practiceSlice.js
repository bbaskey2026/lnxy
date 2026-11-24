import { createSlice } from '@reduxjs/toolkit'

export const practiceQuestions = [
  { id: 'p1', examination: 'SSC CGL', subject: 'Quantitative Aptitude', chapter: 'Time & Work', difficulty: 'Medium', type: 'MCQ', previousYear: false, text: 'If 12 men can complete a work in 18 days, how many men are required to complete it in 8 days?', options: ['27', '24', '30', '18'], correctIndex: 0, explanation: 'Men × days is constant: 12 × 18 = x × 8, so x = 27.' },
  { id: 'p2', examination: 'UPSC', subject: 'Indian Polity', chapter: 'Fundamental Rights', difficulty: 'Easy', type: 'MCQ', previousYear: true, text: 'Which writ is issued to compel a public authority to perform a legal duty?', options: ['Certiorari', 'Mandamus', 'Habeas Corpus', 'Quo Warranto'], correctIndex: 1, explanation: 'Mandamus is issued to compel performance of a public or statutory duty.' },
  { id: 'p3', examination: 'Banking', subject: 'Reasoning', chapter: 'Blood Relations', difficulty: 'Easy', type: 'True/False', previousYear: false, text: 'In a family, if A is the brother of B and B is the mother of C, then A is C’s uncle.', options: ['True', 'False'], correctIndex: 0, explanation: 'A is the maternal uncle of C if he is B’s brother.' },
  { id: 'p4', examination: 'OSSSC RI', subject: 'Odisha GK', chapter: 'Odisha History', difficulty: 'Medium', type: 'MCQ', previousYear: true, text: 'Which freedom movement is associated with the Utkal Sammilani of Odisha?', options: ['Paika Rebellion', 'Federation Movement', 'Integration Movement', 'Quit India Movement'], correctIndex: 1, explanation: 'Utkal Sammilani played a major role in the movement for an independent Odisha province.' },
  { id: 'p5', examination: 'Banking', subject: 'Quantitative Aptitude', chapter: 'Simple Interest', difficulty: 'Hard', type: 'MCQ', previousYear: true, text: 'At what rate percent per annum will ₹1,500 amount to ₹1,950 in 3 years at simple interest?', options: ['8%', '10%', '12%', '15%'], correctIndex: 1, explanation: 'Interest = 450; R = (450 × 100)/(1500 × 3) = 10%.' },
  { id: 'p6', examination: 'SSC CHSL', subject: 'English', chapter: 'Synonyms', difficulty: 'Easy', type: 'MCQ', previousYear: false, text: 'Choose the synonym of "Diligent".', options: ['Lazy', 'Industrious', 'Careless', 'Timid'], correctIndex: 1, explanation: 'Diligent and industrious both describe careful, persistent effort.' },
]

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
    questions: practiceQuestions,
    activeIndex: 0,
    answers: readObject('exampro.practiceAnswers', {}),
    history: readObject('exampro.practiceHistory', []),
    mode: 'instant',
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
})

export const { setPracticeMode, setPracticeIndex, answerPractice } = practiceSlice.actions
export default practiceSlice.reducer
