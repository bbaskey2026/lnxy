import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { courseService } from '../../services/courseService'

export const fetchCourses = createAsyncThunk('courses/fetchCourses', async () => {
  const courses = await courseService.list()
  return courses.filter((course) => course.isPublished !== false).map((course) => ({
    ...course,
    instructor: course.instructorName ?? course.instructor ?? '',
    students: course.studentCount ?? course.students ?? 0,
    lectures: course.lectureCount ?? course.lectures ?? 0,
    rating: course.rating ?? 0,
    modules: course.modules ?? [],
  }))
})

export const fetchEnrolledCourses = createAsyncThunk(
  'courses/fetchEnrolled',
  async () => courseService.listEnrolled(),
)

export const enrollCourse = createAsyncThunk(
  'courses/enroll',
  async (courseId) => courseService.enroll(courseId),
)

const courseSlice = createSlice({
  name: 'courses',
  initialState: {
    items: [],
    enrolledIds: [],
    enrollmentsByCourseId: {},
    selectedCourse: null,
    loading: false,
    enrollmentsLoading: false,
    enrollmentError: null,
    error: null,
  },
  reducers: {
    selectCourse(state, action) {
      state.selectedCourse = state.items.find((course) => course.id === action.payload) ?? null
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
      .addCase(fetchEnrolledCourses.fulfilled, (state, action) => {
        state.enrollmentsLoading = false
        state.enrolledIds = action.payload.map((item) => item.courseId)
        state.enrollmentsByCourseId = Object.fromEntries(action.payload.map((item) => [item.courseId, item]))
      })
      .addCase(fetchEnrolledCourses.pending, (state) => {
        state.enrollmentsLoading = true
        state.enrollmentError = null
      })
      .addCase(fetchEnrolledCourses.rejected, (state, action) => {
        state.enrollmentsLoading = false
        state.enrollmentError = action.error.message
      })
      .addCase(enrollCourse.pending, (state) => {
        state.enrollmentError = null
      })
      .addCase(enrollCourse.fulfilled, (state, action) => {
        const enrollment = action.payload
        if (!state.enrolledIds.includes(enrollment.courseId)) state.enrolledIds.push(enrollment.courseId)
        state.enrollmentsByCourseId[enrollment.courseId] = enrollment
      })
      .addCase(enrollCourse.rejected, (state, action) => {
        state.enrollmentError = action.error.message
      })
  },
})

export const { selectCourse } = courseSlice.actions
export default courseSlice.reducer
