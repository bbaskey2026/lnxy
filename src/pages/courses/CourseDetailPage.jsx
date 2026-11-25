import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { Alert, Avatar, Box, Button, Chip, CircularProgress, LinearProgress, Stack, Typography } from '@mui/material'
import { ArrowLeft, Clock3, PlayCircle, Star } from 'lucide-react'
import { enrollCourse, fetchCourses, fetchEnrolledCourses, selectCourse } from '../../store/slices/courseSlice'
import { fetchLectures } from '../../store/slices/lectureSlice'
import { useAppFeedback } from '../../hooks/useAppFeedback'
import ExamLogo from '../../components/ExamLogo'

export default function CourseDetailPage() {
  const { courseId } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { showToast } = useAppFeedback()
  const { items, selectedCourse, enrolledIds, enrollmentsByCourseId, loading, enrollmentError } = useSelector((state) => state.courses)
  const lectures = useSelector((state) => state.lectures.items)

  useEffect(() => {
    if (!items.length) dispatch(fetchCourses())
    dispatch(fetchEnrolledCourses())
    if (!lectures.length) dispatch(fetchLectures())
  }, [dispatch, items.length, lectures.length])

  useEffect(() => {
    dispatch(selectCourse(courseId))
  }, [dispatch, courseId, items])

  if (!selectedCourse && loading) {
    return <Box sx={{ p: 6, display: 'grid', placeItems: 'center' }}><CircularProgress /></Box>
  }

  if (!selectedCourse) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Course not found.</Typography>
        <Button onClick={() => navigate('/student/courses')}>Back to courses</Button>
      </Box>
    )
  }

  const enrolled = enrolledIds.includes(selectedCourse.id)
  const progress = enrollmentsByCourseId[selectedCourse.id]?.progress ?? 0
  const courseLecture = lectures.find((lecture) => lecture.courseId === selectedCourse.id)
  const handleCourseAction = () => {
    if (!enrolled) {
      dispatch(enrollCourse(selectedCourse.id))
      return
    }
    if (courseLecture) {
      navigate(`/student/lectures/${courseLecture.id}`)
      return
    }
    showToast('No lectures have been published for this course yet.', 'info')
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1120, mx: 'auto' }}>
      {enrollmentError && <Alert severity="error" sx={{ mb: 2 }}>{enrollmentError}</Alert>}
      <Button startIcon={<ArrowLeft size={16} />} onClick={() => navigate('/student/courses')} sx={{ mb: 2 }}>All courses</Button>
      <Box sx={{ p: { xs: 2.5, md: 4 }, bgcolor: 'primary.main', color: 'white', borderRadius: 3, mb: 3 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems={{ md: 'center' }}>
          <ExamLogo name={selectedCourse.title} size={100} />
          <Box sx={{ flex: 1 }}>
            <Chip label={selectedCourse.category} sx={{ bgcolor: 'rgba(255,255,255,.15)', color: 'white', mb: 1 }} />
            <Typography variant="h4">{selectedCourse.title}</Typography>
            <Typography sx={{ mt: 1, opacity: 0.82 }}>{selectedCourse.description}</Typography>
            <Stack direction="row" spacing={2} sx={{ mt: 2, flexWrap: 'wrap' }}>
              <Typography variant="body2">By {selectedCourse.instructor}</Typography>
              <Stack direction="row" spacing={0.5}><Star size={16} fill="#fbbf24" color="#fbbf24" /><Typography variant="body2">{selectedCourse.rating}</Typography></Stack>
              <Typography variant="body2">{selectedCourse.students.toLocaleString()} students</Typography>
            </Stack>
          </Box>
          <Button variant="contained" color="inherit" sx={{ color: 'primary.main', minWidth: 150 }} onClick={handleCourseAction}>
            <PlayCircle size={18} style={{ marginRight: 8 }} />
            {enrolled ? 'Continue learning' : 'Enroll'}
          </Button>
        </Stack>
      </Box>

      {enrolled && (
        <Box sx={{ mb: 3, p: 2, bgcolor: 'white', border: '1px solid #e9edf4', borderRadius: 2 }}>
          <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.75 }}>
            <Typography fontWeight={800}>Course progress</Typography>
            <Typography fontWeight={800}>{progress}%</Typography>
          </Stack>
          <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 99 }} />
        </Box>
      )}

      <Typography variant="h5" sx={{ mb: 2 }}>Course syllabus</Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 2 }}>
        {selectedCourse.modules.map((module, index) => (
          <Box key={module.title} sx={{ p: 2.5, bgcolor: 'white', border: '1px solid #e9edf4', borderRadius: 2.5 }}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Avatar sx={{ width: 38, height: 38, bgcolor: 'primary.light', color: 'primary.main' }}>
              {index + 1}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography fontWeight={800}>{module.title}</Typography>
                <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 0.25 }}>
                  <Clock3 size={14} />
                  <Typography variant="caption" color="text.secondary">{module.lessons} lectures</Typography>
                </Stack>
              </Box>
            </Stack>
          </Box>
        ))}
      </Box>
      {!selectedCourse.modules.length && (
        <Box sx={{ p: 4, textAlign: 'center', bgcolor: 'white', border: '1px solid #e9edf4' }}>
          <Typography color="text.secondary">The course syllabus has not been added yet.</Typography>
        </Box>
      )}
    </Box>
  )
}
