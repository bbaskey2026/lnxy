import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { Avatar, Box, Button, Chip, LinearProgress, Stack, Typography } from '@mui/material'
import { ArrowLeft, CheckCircle2, Clock3, PlayCircle, Star } from 'lucide-react'
import { fetchCourses, selectCourse } from '../../store/slices/courseSlice'

export default function CourseDetailPage() {
  const { courseId } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { items, selectedCourse, enrolledIds } = useSelector((state) => state.courses)

  useEffect(() => {
    if (!items.length) dispatch(fetchCourses())
  }, [dispatch, items.length])

  useEffect(() => {
    dispatch(selectCourse(courseId))
  }, [dispatch, courseId, items])

  if (!selectedCourse) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Course not found.</Typography>
        <Button onClick={() => navigate('/student/courses')}>Back to courses</Button>
      </Box>
    )
  }

  const enrolled = enrolledIds.includes(selectedCourse.id)
  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1120, mx: 'auto' }}>
      <Button startIcon={<ArrowLeft size={16} />} onClick={() => navigate('/student/courses')} sx={{ mb: 2 }}>All courses</Button>
      <Box sx={{ p: { xs: 2.5, md: 4 }, bgcolor: 'primary.main', color: 'white', borderRadius: 3, mb: 3 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems={{ md: 'center' }}>
          <Avatar variant="rounded" sx={{ width: 100, height: 100, bgcolor: 'rgba(255,255,255,.15)', fontSize: 28, fontWeight: 900 }}>
            {selectedCourse.category.slice(0, 2).toUpperCase()}
          </Avatar>
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
          <Button variant="contained" color="inherit" sx={{ color: 'primary.main', minWidth: 150 }} onClick={() => navigate(`/student/lectures/lesson-1`)}>
            <PlayCircle size={18} style={{ marginRight: 8 }} />
            {enrolled ? 'Continue' : 'Preview'}
          </Button>
        </Stack>
      </Box>

      {enrolled && (
        <Box sx={{ mb: 3, p: 2, bgcolor: 'white', border: '1px solid #e9edf4', borderRadius: 2 }}>
          <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.75 }}>
            <Typography fontWeight={800}>Course progress</Typography>
            <Typography fontWeight={800}>{selectedCourse.progress}%</Typography>
          </Stack>
          <LinearProgress variant="determinate" value={selectedCourse.progress} sx={{ height: 8, borderRadius: 99 }} />
        </Box>
      )}

      <Typography variant="h5" sx={{ mb: 2 }}>Course syllabus</Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 2 }}>
        {selectedCourse.modules.map((module, index) => (
          <Box key={module.title} sx={{ p: 2.5, bgcolor: 'white', border: '1px solid #e9edf4', borderRadius: 2.5 }}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Avatar sx={{ width: 38, height: 38, bgcolor: index < 2 ? 'success.main' : 'primary.light', color: index < 2 ? 'white' : 'primary.main' }}>
                {index < 2 ? <CheckCircle2 size={18} /> : index + 1}
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
    </Box>
  )
}
