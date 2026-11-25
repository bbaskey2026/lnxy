import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { platformService } from '../../services/platformService'

export const fetchAnalytics = createAsyncThunk(
  'analytics/fetchAnalytics',
  () => platformService.getAnalytics(),
)

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState: {
    data: null,
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnalytics.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchAnalytics.fulfilled, (state, action) => {
        state.data = action.payload
        state.status = 'succeeded'
      })
      .addCase(fetchAnalytics.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
  },
})

export default analyticsSlice.reducer
