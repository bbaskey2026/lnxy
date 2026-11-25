import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  LinearProgress,
  Stack,
  Tab,
  Tabs,
  Typography,
} from '@mui/material'
import { BookOpen, Clock3, Star } from 'lucide-react'
import { enrollCourse, fetchCourses, fetchEnrolledCourses } from '../../store/slices/courseSlice'
import ExamLogo from '../../components/ExamLogo'

export default function CourseListPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { items, enrolledIds, enrollmentsByCourseId, loading, enrollmentsLoading, error, enrollmentError } = useSelector((state) => state.courses)
  const [view, setView] = useState('all')

  useEffect(() => {
    dispatch(fetchCourses())
    dispatch(fetchEnrolledCourses())
  }, [dispatch])

  const filtered = useMemo(
    () => view === 'enrolled' ? items.filter((course) => enrolledIds.includes(course.id)) : items,
    [items, view, enrolledIds],
  )

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1440, mx: 'auto' }}>
      <Typography variant="h4" sx={{ mb: 0.5 }}>Courses</Typography>
      <Typography color="text.secondary" sx={{ mb: 2 }}>Build your preparation journey with expert-led courses.</Typography>
      {(error || enrollmentError) && <Alert severity="error" sx={{ mb: 2 }}>{error ?? enrollmentError}</Alert>}
      <Tabs value={view} onChange={(_, value) => setView(value)} sx={{ mb: 3 }}>
        <Tab value="all" label="All courses" />
        <Tab value="enrolled" label={`My courses (${enrolledIds.length})`} />
      </Tabs>
      {(loading || enrollmentsLoading) && <CircularProgress />}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, gap: 2 }}>
        {filtered.map((course) => {
          const enrolled = enrolledIds.includes(course.id)
          const progress = enrollmentsByCourseId[course.id]?.progress ?? 0
          return (
            <Card key={course.id} sx={{ height: '100%' }}>
              <CardContent sx={{ p: 2.5, height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                  <ExamLogo name={course.title} size={58} />
                  <Chip label={course.category} size="small" variant="outlined" />
                </Stack>
                <Typography variant="h6" sx={{ mt: 2 }}>{course.title}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>By {course.instructor}</Typography>
                <Stack direction="row" spacing={2} sx={{ my: 2 }}>
                  <Stack direction="row" spacing={0.5} alignItems="center"><BookOpen size={15} /><Typography variant="caption">{course.lectures} lessons</Typography></Stack>
                  <Stack direction="row" spacing={0.5} alignItems="center"><Clock3 size={15} /><Typography variant="caption">{course.duration}</Typography></Stack>
                  <Stack direction="row" spacing={0.5} alignItems="center"><Star size={15} fill="#f59e0b" color="#f59e0b" /><Typography variant="caption">{course.rating}</Typography></Stack>
                </Stack>
                {enrolled && (
                  <Box sx={{ mb: 2 }}>
                    <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                      <Typography variant="caption" color="text.secondary">Progress</Typography>
                      <Typography variant="caption" fontWeight={800}>{progress}%</Typography>
                    </Stack>
                    <LinearProgress variant="determinate" value={progress} sx={{ height: 6, borderRadius: 99 }} />
                  </Box>
                )}
                <Stack direction="row" spacing={1} sx={{ mt: 'auto' }}>
                  <Button variant="contained" sx={{ flex: 1 }} onClick={() => navigate(`/student/courses/${course.id}`)}>
                    {enrolled ? 'Continue' : 'View course'}
                  </Button>
                  {!enrolled && (
                  <Button variant="outlined" onClick={() => dispatch(enrollCourse(course.id))}>Enroll</Button>
                  )}
                </Stack>
              </CardContent>
            </Card>
          )
        })}
      </Box>
      {!loading && !enrollmentsLoading && !error && !enrollmentError && !filtered.length && (
        <Box sx={{ mt: 2, p: 4, textAlign: 'center', bgcolor: 'white', border: '1px solid #e9edf4' }}>
          <Typography fontWeight={800}>{view === 'enrolled' ? 'No enrolled courses' : 'No courses available'}</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {view === 'enrolled' ? 'Enroll in a course to find it here.' : 'Courses will appear here when published.'}
          </Typography>
        </Box>
      )}
    </Box>
  )
}
