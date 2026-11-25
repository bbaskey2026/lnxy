import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { platformService } from '../../services/platformService'

export const fetchCurrentAffairs = createAsyncThunk(
  'currentAffairs/fetchCurrentAffairs',
  async () => (await platformService.listCurrentAffairs()).map((item) => ({
    ...item,
    summary: item.summary ?? item.description ?? '',
    date: item.date ?? item.createdAt ?? '',
  })),
)

const currentAffairsSlice = createSlice({
  name: 'currentAffairs',
  initialState: { items: [], loading: false, loaded: false, error: null, selectedPeriod: 'daily' },
  reducers: {
    setSelectedPeriod(state, action) {
      state.selectedPeriod = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentAffairs.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCurrentAffairs.fulfilled, (state, action) => {
        state.loading = false
        state.loaded = true
        state.items = action.payload
      })
      .addCase(fetchCurrentAffairs.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
  },
})

export const { setSelectedPeriod } = currentAffairsSlice.actions
export default currentAffairsSlice.reducer
