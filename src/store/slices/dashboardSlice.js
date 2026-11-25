import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { platformService } from '../../services/platformService'

export const fetchDashboard = createAsyncThunk(
  'dashboard/fetchDashboard',
  () => platformService.getAnalytics(),
)

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    data: null,
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
        state.data = action.payload
        state.status = 'succeeded'
      })
      .addCase(fetchDashboard.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
  },
})

export default dashboardSlice.reducer
