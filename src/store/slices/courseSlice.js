import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { courseService } from '../../services/courseService'

export const fetchCourses = createAsyncThunk('courses/fetchCourses', async () => {
  const courses = await courseService.list()
  return courses.map((course) => ({
    ...course,
    instructor: course.instructorName ?? course.instructor ?? 'ExamPro Instructor',
    students: course.studentCount ?? course.students ?? 0,
    lectures: course.lectureCount ?? course.lectures ?? 0,
    progress: course.progress ?? 0,
    rating: course.rating ?? 0,
    modules: course.modules ?? [],
  }))
})

const courseSlice = createSlice({
  name: 'courses',
  initialState: {
    items: [],
    enrolledIds: ['ssc-cgl-foundation', 'odisha-ri-aris'],
    selectedCourse: null,
    loading: false,
    error: null,
  },
  reducers: {
    setCourses(state, action) {
      state.items = action.payload
    },
    selectCourse(state, action) {
      state.selectedCourse = state.items.find((course) => course.id === action.payload) ?? null
    },
    enrollCourse(state, action) {
      if (!state.enrolledIds.includes(action.payload)) state.enrolledIds.push(action.payload)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourses.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
  },
})

export const { setCourses, selectCourse, enrollCourse } = courseSlice.actions
export default courseSlice.reducer
