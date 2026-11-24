import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import userReducer from './slices/userSlice'
import courseReducer from './slices/courseSlice'
import dashboardReducer from './slices/dashboardSlice'
import analyticsReducer from './slices/analyticsSlice'
import notificationReducer from './slices/notificationSlice'
import studyMaterialReducer from './slices/studyMaterialSlice'
import lectureReducer from './slices/lectureSlice'
import mockTestReducer from './slices/mockTestSlice'
import practiceReducer from './slices/practiceSlice'
import previousPaperReducer from './slices/previousPaperSlice'
import currentAffairsReducer from './slices/currentAffairsSlice'
import bookmarkReducer from './slices/bookmarkSlice'
import notesReducer from './slices/notesSlice'
import adminReducer from './slices/adminSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    courses: courseReducer,
    dashboard: dashboardReducer,
    analytics: analyticsReducer,
    notifications: notificationReducer,
    studyMaterials: studyMaterialReducer,
    lectures: lectureReducer,
    mockTests: mockTestReducer,
    practice: practiceReducer,
    previousPapers: previousPaperReducer,
    currentAffairs: currentAffairsReducer,
    bookmarks: bookmarkReducer,
    notes: notesReducer,
    admin: adminReducer,
  },
})
