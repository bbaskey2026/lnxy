import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Alert, Box, Button, Card, CardContent, CircularProgress, Stack, Typography } from '@mui/material'
import { BookOpen, Clock3, Target, Trophy } from 'lucide-react'
import { fetchDashboard } from '../../store/slices/dashboardSlice'

export default function StudentDashboardPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const dashboard = useSelector((state) => state.dashboard)
  const currentUser = useSelector((state) => state.auth.currentUser)

  useEffect(() => {
    dispatch(fetchDashboard())
  }, [dispatch])

  const displayName = currentUser?.name?.split(' ')[0] ?? 'there'
  const summary = dashboard.data ? [
    { label: 'Mock tests completed', value: dashboard.data.mockTestsTaken ?? 0, icon: Trophy, color: '#f59e0b' },
    { label: 'Average accuracy', value: `${dashboard.data.averageAccuracy ?? 0}%`, icon: Target, color: '#4361ee' },
    { label: 'Preparation progress', value: `${dashboard.data.preparationProgress ?? 0}%`, icon: BookOpen, color: '#16a34a' },
    { label: 'Study hours', value: dashboard.data.studyHours === null ? '—' : `${dashboard.data.studyHours ?? 0}h`, icon: Clock3, color: '#a855f7' },
  ] : []

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1440, mx: 'auto' }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h4">Welcome, {displayName}</Typography>
          <Typography color="text.secondary" sx={{ mt: 0.5 }}>Your preparation summary is based on your saved results.</Typography>
        </Box>
        <Button variant="contained" onClick={() => navigate('/student/mock-tests')} sx={{ mt: { xs: 2, sm: 0 } }}>
          Browse mock tests
        </Button>
      </Stack>

      {dashboard.error && (
        <Alert
          severity="error"
          action={<Button color="inherit" size="small" onClick={() => dispatch(fetchDashboard())}>Retry</Button>}
          sx={{ mb: 2 }}
        >
          {dashboard.error}
        </Alert>
      )}

      {dashboard.status === 'loading' && !dashboard.data ? (
        <Box sx={{ py: 8, display: 'grid', placeItems: 'center' }}><CircularProgress /></Box>
      ) : dashboard.data ? (
        <>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }, gap: 2, mb: 3 }}>
            {summary.map(({ label, value, icon: Icon, color }) => (
              <Card key={label}>
                <CardContent sx={{ p: 2.25 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                    <Box>
                      <Typography variant="body2" color="text.secondary">{label}</Typography>
                      <Typography variant="h5" sx={{ mt: 0.75 }}>{value}</Typography>
                    </Box>
                    <Box sx={{ width: 42, height: 42, borderRadius: 2, bgcolor: `${color}14`, color, display: 'grid', placeItems: 'center' }}>
                      <Icon size={20} />
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Box>

          <Card>
            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
              <Typography variant="h6">Continue your preparation</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                Choose a learning resource to continue. Your dashboard updates as backend results become available.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mt: 2 }}>
                <Button variant="outlined" onClick={() => navigate('/student/courses')}>Explore courses</Button>
                <Button variant="outlined" onClick={() => navigate('/student/study-materials')}>Study materials</Button>
                <Button variant="outlined" onClick={() => navigate('/student/analytics')}>View analytics</Button>
              </Stack>
            </CardContent>
          </Card>
        </>
      ) : null}
    </Box>
  )
}
