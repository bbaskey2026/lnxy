import { createSlice } from '@reduxjs/toolkit'

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    examinations: [
      { id: 'ssc-cgl', name: 'SSC CGL', category: 'SSC Examinations', status: 'Active', subjects: 4, tests: 24 },
      { id: 'osssc-ri', name: 'OSSSC RI', category: 'Odisha Government', status: 'Active', subjects: 4, tests: 16 },
      { id: 'ibps-po', name: 'IBPS PO', category: 'Banking', status: 'Draft', subjects: 4, tests: 30 },
    ],
    courses: [
      { id: 'ssc-cgl-foundation', title: 'SSC CGL Complete Foundation', instructor: 'Rohit Sharma', status: 'Published', students: 18420 },
      { id: 'odisha-ri-aris', title: 'OSSSC RI, ARI & AMIN Masterclass', instructor: 'Priya Das', status: 'Published', students: 9650 },
      { id: 'banking-achievers', title: 'Banking Achievers Program', instructor: 'Ananya Roy', status: 'Draft', students: 23100 },
    ],
    users: [
      { id: 'u1', name: 'Aarav Sharma', email: 'aarav@example.com', role: 'student', status: 'Active' },
      { id: 'u2', name: 'Rohit Sharma', email: 'rohit@exampro.com', role: 'instructor', status: 'Active' },
      { id: 'u3', name: 'Priya Das', email: 'priya@exampro.com', role: 'instructor', status: 'Active' },
      { id: 'u4', name: 'Neha Admin', email: 'admin@exampro.com', role: 'admin', status: 'Active' },
    ],
  },
  reducers: {
    addExamination(state, action) {
      state.examinations.unshift({
        id: `exam-${Date.now()}`,
        status: 'Draft',
        subjects: 0,
        tests: 0,
        ...action.payload,
      })
    },
    updateExaminationStatus(state, action) {
      const examination = state.examinations.find((item) => item.id === action.payload.id)
      if (examination) examination.status = action.payload.status
    },
    updateUserStatus(state, action) {
      const user = state.users.find((item) => item.id === action.payload.id)
      if (user) user.status = action.payload.status
    },
  },
})

export const { addExamination, updateExaminationStatus, updateUserStatus } = adminSlice.actions
export default adminSlice.reducer
