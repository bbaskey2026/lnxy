import { createSlice } from '@reduxjs/toolkit'

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState: {
    period: 'weekly',
    studyHours: 42.5,
    mockTestsTaken: 12,
    preparationProgress: 68,
    weeklyPerformance: [
      { label: 'Mon', score: 58, studyHours: 5.2 },
      { label: 'Tue', score: 62, studyHours: 6.1 },
      { label: 'Wed', score: 68, studyHours: 5.8 },
      { label: 'Thu', score: 65, studyHours: 6.4 },
      { label: 'Fri', score: 72, studyHours: 7.0 },
      { label: 'Sat', score: 76, studyHours: 7.5 },
      { label: 'Sun', score: 82, studyHours: 4.5 },
    ],
    monthlyPerformance: [
      { label: 'Week 1', score: 55, studyHours: 22 },
      { label: 'Week 2', score: 61, studyHours: 26 },
      { label: 'Week 3', score: 69, studyHours: 31 },
      { label: 'Week 4', score: 78, studyHours: 34 },
    ],
    subjectAccuracy: [
      { subject: 'Quantitative Aptitude', accuracy: 72 },
      { subject: 'Reasoning', accuracy: 84 },
      { subject: 'English', accuracy: 79 },
      { subject: 'General Studies', accuracy: 61 },
      { subject: 'Current Affairs', accuracy: 68 },
    ],
    topicAccuracy: [
      { topic: 'Time & Work', accuracy: 88 },
      { topic: 'Syllogism', accuracy: 86 },
      { topic: 'Fundamental Rights', accuracy: 73 },
      { topic: 'Profit & Loss', accuracy: 64 },
      { topic: 'Indian Economy', accuracy: 58 },
    ],
    strongTopics: ['Time & Work', 'Syllogism', 'Grammar'],
    weakTopics: ['Indian Economy', 'Profit & Loss', 'Modern History'],
    recommendations: [
      { id: 'r1', title: 'Revise Indian Economy', detail: 'Based on 58% topic accuracy', action: 'Study', route: '/student/study-materials' },
      { id: 'r2', title: 'Practice Profit & Loss', detail: '12 recent questions answered incorrectly', action: 'Practice', route: '/student/practice' },
      { id: 'r3', title: 'Take a General Studies Mock', detail: 'Your subject accuracy is below target', action: 'Attempt', route: '/student/mock-tests' },
    ],
  },
  reducers: {
    setAnalyticsPeriod(state, action) {
      state.period = action.payload
    },
  },
})

export const { setAnalyticsPeriod } = analyticsSlice.actions

export default analyticsSlice.reducer
