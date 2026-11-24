import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

export const fetchDashboard = createAsyncThunk(
  'dashboard/fetchDashboard',
  async (_, { rejectWithValue }) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 350))
      return {
        enrolledExams: [
          { id: 'ssc-cgl', name: 'SSC CGL', progress: 72, color: '#4361ee' },
          { id: 'odisha-ocs', name: 'Odisha OCS', progress: 48, color: '#16a34a' },
        ],
        upcomingExams: [
          { id: '1', name: 'SSC CGL Tier I', date: '2026-12-18', daysLeft: 24, type: 'Mock exam' },
          { id: '2', name: 'Odisha RI Prelims', date: '2027-01-09', daysLeft: 46, type: 'Prelims' },
        ],
        recentActivities: [
          { id: '1', title: 'Completed Lesson 8', detail: 'Time & Work', time: '35 min ago', kind: 'lecture' },
          { id: '2', title: 'Scored 82% in mock test', detail: 'Quantitative Aptitude', time: 'Yesterday', kind: 'test' },
          { id: '3', title: 'Downloaded revision notes', detail: 'Indian Polity', time: 'Yesterday', kind: 'material' },
        ],
        recommendations: [
          { id: '1', title: 'Indian Economy - Budget 2026', type: 'Revision notes', duration: '20 min', progress: 0 },
          { id: '2', title: 'Advanced Number Series', type: 'Practice set', duration: '30 min', progress: 12 },
          { id: '3', title: 'Constitutional Amendments', type: 'Video lecture', duration: '42 min', progress: 35 },
        ],
      }
    } catch (error) {
      return rejectWithValue(error.message)
    }
  },
)

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    enrolledExams: [],
    upcomingExams: [],
    recentActivities: [],
    recommendations: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboard.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchDashboard.fulfilled, (state, action) => {
        Object.assign(state, action.payload)
        state.status = 'succeeded'
      })
      .addCase(fetchDashboard.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
  },
})

export default dashboardSlice.reducer
