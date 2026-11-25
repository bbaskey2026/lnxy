import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { CircularProgress, Box } from '@mui/material'
import { ProtectedRoute } from './ProtectedRoute'

const AppLayout = lazy(() => import('../layout/AppLayout'))
const LoginPage = lazy(() => import('../pages/auth/LoginPage'))
const RegisterPage = lazy(() => import('../pages/auth/RegisterPage'))
const StudentDashboardPage = lazy(() => import('../pages/dashboard/StudentDashboardPage'))
const ProfilePage = lazy(() => import('../pages/profile/ProfilePage'))
const UnauthorizedPage = lazy(() => import('../pages/auth/UnauthorizedPage'))
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'))
const ExaminationDiscoveryPage = lazy(() => import('../pages/exams/ExaminationDiscoveryPage'))
const ExaminationDetailPage = lazy(() => import('../pages/exams/ExaminationDetailPage'))
const CourseListPage = lazy(() => import('../pages/courses/CourseListPage'))
const CourseDetailPage = lazy(() => import('../pages/courses/CourseDetailPage'))
const StudyMaterialsPage = lazy(() => import('../pages/study-materials/StudyMaterialsPage'))
const LecturePlayerPage = lazy(() => import('../pages/lectures/LecturePlayerPage'))
const MockTestListPage = lazy(() => import('../pages/mock-tests/MockTestListPage'))
const MockTestPage = lazy(() => import('../pages/mock-tests/MockTestPage'))
const PracticePage = lazy(() => import('../pages/practice/PracticePage'))
const PreviousPapersPage = lazy(() => import('../pages/previous-papers/PreviousPapersPage'))
const CurrentAffairsPage = lazy(() => import('../pages/current-affairs/CurrentAffairsPage'))
const BookmarksPage = lazy(() => import('../pages/bookmarks/BookmarksPage'))
const NotesPage = lazy(() => import('../pages/notes/NotesPage'))
const AnalyticsPage = lazy(() => import('../pages/analytics/AnalyticsPage'))
const NotificationsPage = lazy(() => import('../pages/notifications/NotificationsPage'))
const HomePage = lazy(() => import('../pages/public/HomePage'))
const AboutPage = lazy(() => import('../pages/public/AboutPage'))
const ContactPage = lazy(() => import('../pages/public/ContactPage'))
const AdminLayout = lazy(() => import('../layout/AdminLayout'))
const AdminDashboardPage = lazy(() => import('../pages/admin/AdminDashboardPage'))
const AdminManagementPage = lazy(() => import('../pages/admin/AdminManagementPage'))

function LoadingScreen() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
      <CircularProgress />
    </Box>
  )
}

export function AppRoutes() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="/" element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path="exams" element={<ExaminationDiscoveryPage />} />
          <Route path="exams/:examId" element={<ExaminationDetailPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />
        </Route>
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
            <Route path="/admin/exams" element={<AdminManagementPage section="exams" />} />
            <Route path="/admin/courses" element={<AdminManagementPage section="courses" />} />
            <Route path="/admin/materials" element={<AdminManagementPage section="materials" />} />
            <Route path="/admin/users" element={<AdminManagementPage section="users" />} />
            <Route path="/admin/reports" element={<AdminManagementPage section="reports" />} />
          </Route>
        </Route>
        <Route element={<ProtectedRoute allowedRoles={['student', 'instructor', 'admin']} />}>
          <Route element={<AppLayout />}>
            <Route path="/student/dashboard" element={<StudentDashboardPage />} />
            <Route path="/student/profile" element={<ProfilePage />} />
            <Route path="/student/courses" element={<CourseListPage />} />
            <Route path="/student/courses/:courseId" element={<CourseDetailPage />} />
            <Route path="/student/study-materials" element={<StudyMaterialsPage />} />
            <Route path="/student/lectures/:lectureId" element={<LecturePlayerPage />} />
            <Route path="/student/mock-tests" element={<MockTestListPage />} />
            <Route path="/student/mock-tests/:testId" element={<MockTestPage />} />
            <Route path="/student/practice" element={<PracticePage />} />
            <Route path="/student/previous-papers" element={<PreviousPapersPage />} />
            <Route path="/student/current-affairs" element={<CurrentAffairsPage />} />
            <Route path="/student/bookmarks" element={<BookmarksPage />} />
            <Route path="/student/notes" element={<NotesPage />} />
            <Route path="/student/analytics" element={<AnalyticsPage />} />
            <Route path="/student/notifications" element={<NotificationsPage />} />
            <Route path="/student/:section" element={<NotFoundPage />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  )
}
