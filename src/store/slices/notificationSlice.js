import { createSlice } from '@reduxjs/toolkit'

const initialItems = [
  { id: 'n1', title: 'New SSC CGL mock test is live', detail: 'Full Mock 02 is now available in the test library.', category: 'Mock tests', createdAt: '2026-11-24T20:15:00', read: false, route: '/student/mock-tests' },
  { id: 'n2', title: 'Live class starts in 30 minutes', detail: 'Quantitative Aptitude - Time & Work with Rohit Sharma.', category: 'Live classes', createdAt: '2026-11-24T19:40:00', read: false, route: '/student/courses/ssc-cgl-foundation' },
  { id: 'n3', title: 'November current affairs PDF added', detail: 'The latest national and Odisha affairs collection is ready.', category: 'Study materials', createdAt: '2026-11-24T17:30:00', read: true, route: '/student/study-materials' },
  { id: 'n4', title: 'Weekly performance report', detail: 'Your average score improved by 8.2% this week.', category: 'Analytics', createdAt: '2026-11-23T18:00:00', read: true, route: '/student/analytics' },
]

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: {
    items: initialItems,
    unreadCount: initialItems.filter((item) => !item.read).length,
  },
  reducers: {
    markAllRead(state) {
      state.unreadCount = 0
      state.items = state.items.map((item) => ({ ...item, read: true }))
    },
    markRead(state, action) {
      const item = state.items.find((entry) => entry.id === action.payload)
      if (item && !item.read) {
        item.read = true
        state.unreadCount = state.items.filter((entry) => !entry.read).length
      }
    },
  },
})

export const { markAllRead, markRead } = notificationSlice.actions
export default notificationSlice.reducer
