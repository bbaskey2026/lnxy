import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Box, Button, Chip, Container, Divider, Stack, Typography } from '@mui/material'
import { ArrowLeft, Clock3, FileCheck2, Target, Users } from 'lucide-react'
import { examService } from '../../services/examService'
import ExamLogo from '../../components/ExamLogo'

export default function ExaminationDetailPage() {
  const { examId } = useParams()
  const navigate = useNavigate()
  const [exam, setExam] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    examService.getById(examId)
      .then(setExam)
      .catch((requestError) => setError(requestError.response?.data?.error?.message ?? 'Unable to load examination.'))
      .finally(() => setLoading(false))
  }, [examId])

  if (loading) {
    return <Container sx={{ py: 6 }}><Typography>Loading examination...</Typography></Container>
  }

  if (error) {
    return <Container sx={{ py: 6 }}><Typography color="error">{error}</Typography></Container>
  }

  if (!exam) {
    return (
      <Container sx={{ py: 6 }}>
        <Typography variant="h5">Examination not found</Typography>
        <Button sx={{ mt: 2 }} onClick={() => navigate('/exams')}>Browse examinations</Button>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
      <Button startIcon={<ArrowLeft size={16} />} onClick={() => navigate('/exams')} sx={{ mb: 2 }}>
        All examinations
      </Button>
      <Box sx={{ p: { xs: 2.5, md: 4 }, bgcolor: 'primary.main', color: 'white', borderRadius: 3, mb: 3 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ sm: 'center' }}>
          <ExamLogo name={exam.name} size={72} />
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4">{exam.name}</Typography>
            <Typography sx={{ mt: 1, opacity: 0.82 }}>{exam.description}</Typography>
          </Box>
          <Button variant="contained" color="inherit" sx={{ color: 'primary.main', whiteSpace: 'nowrap' }}
            onClick={() => navigate('/login')}>
            Explore courses
          </Button>
        </Stack>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1.4fr .6fr' }, gap: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ mb: 2 }}>Examination overview</Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
            {[
              { icon: Users, label: 'Eligibility', value: exam.eligibility },
              { icon: FileCheck2, label: 'Exam pattern', value: exam.pattern },
              { icon: Clock3, label: 'Duration', value: exam.durationMinutes ? `${exam.durationMinutes} minutes` : 'Not specified' },
              { icon: Target, label: 'Negative marking', value: exam.negativeMarking },
            ].map(({ icon: Icon, label, value }) => (
              <Box key={label} sx={{ p: 2.5, bgcolor: 'white', border: '1px solid #e9edf4', borderRadius: 2.5 }}>
                <Stack direction="row" spacing={1.25} alignItems="center" sx={{ mb: 1 }}>
                  <Icon size={18} color="#4361ee" />
                  <Typography variant="body2" fontWeight={800}>{label}</Typography>
                </Stack>
                <Typography variant="body2" color="text.secondary">{value}</Typography>
              </Box>
            ))}
          </Box>
          <Typography variant="h6" sx={{ mt: 3, mb: 1.5 }}>Subjects</Typography>
          <Stack direction="row" flexWrap="wrap" gap={1}>
            {exam.subjects.map((subject) => <Chip key={subject} label={subject} />)}
          </Stack>
        </Box>
        <Box sx={{ p: 2.5, bgcolor: 'white', border: '1px solid #e9edf4', borderRadius: 2.5, alignSelf: 'start' }}>
          <Typography variant="h6">Quick facts</Typography>
          <Divider sx={{ my: 1.5 }} />
          <Stack spacing={1.5}>
            <Stack direction="row" justifyContent="space-between"><Typography color="text.secondary">Total marks</Typography><Typography fontWeight={800}>{exam.totalMarks}</Typography></Stack>
          </Stack>
        </Box>
      </Box>
    </Container>
  )
}
