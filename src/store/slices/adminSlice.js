import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { adminService } from '../../services/adminService'
import { platformService } from '../../services/platformService'

export const fetchAdminOverview = createAsyncThunk(
  'admin/fetchOverview',
  () => adminService.getOverview(),
)

export const fetchAdminSection = createAsyncThunk(
  'admin/fetchSection',
  async (section) => ({ section, records: await adminService.listSection(section) }),
)

export const createAdminExam = createAsyncThunk(
  'admin/createExam',
  (exam) => platformService.createExam(exam),
)

export const updateExaminationStatus = createAsyncThunk(
  'admin/updateExaminationStatus',
  ({ id, status }) => platformService.updateExam(id, { isActive: status === 'Active' }),
)

export const updateUserStatus = createAsyncThunk(
  'admin/updateUserStatus',
  ({ id, status }) => platformService.updateUser(id, { status: status.toLowerCase() }),
)

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    examinations: [],
    courses: [],
    materials: [],
    users: [],
    loading: false,
    sectionLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminOverview.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAdminOverview.fulfilled, (state, action) => {
        state.loading = false
        Object.assign(state, action.payload)
      })
      .addCase(fetchAdminOverview.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      .addCase(fetchAdminSection.pending, (state) => {
        state.sectionLoading = true
        state.error = null
      })
      .addCase(fetchAdminSection.fulfilled, (state, action) => {
        state.sectionLoading = false
        state[action.payload.section] = action.payload.records
      })
      .addCase(fetchAdminSection.rejected, (state, action) => {
        state.sectionLoading = false
        state.error = action.error.message
      })
      .addCase(createAdminExam.fulfilled, (state, action) => {
        state.examinations.unshift(action.payload)
      })
      .addCase(createAdminExam.rejected, (state, action) => {
        state.error = action.error.message
      })
      .addCase(updateExaminationStatus.fulfilled, (state, action) => {
        const index = state.examinations.findIndex((exam) => exam.id === action.payload.id)
        if (index !== -1) state.examinations[index] = action.payload
      })
      .addCase(updateExaminationStatus.rejected, (state, action) => {
        state.error = action.error.message
      })
      .addCase(updateUserStatus.fulfilled, (state, action) => {
        const index = state.users.findIndex((user) => user.id === action.payload.id)
        if (index !== -1) state.users[index] = action.payload
      })
      .addCase(updateUserStatus.rejected, (state, action) => {
        state.error = action.error.message
      })
  },
})

export default adminSlice.reducer
