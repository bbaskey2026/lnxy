import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Alert, Box, Button, Card, CardContent, Chip, CircularProgress, LinearProgress, Stack, Typography } from '@mui/material'
import { ArrowRight, Clock3, Target, Trophy } from 'lucide-react'
import { fetchAnalytics } from '../../store/slices/analyticsSlice'

const EmptyMessage = ({ children }) => (
  <Typography variant="body2" color="text.secondary">{children}</Typography>
)

export default function AnalyticsPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { data, status, error } = useSelector((state) => state.analytics)

  useEffect(() => {
    dispatch(fetchAnalytics())
  }, [dispatch])

  const summaryCards = data ? [
    { label: 'Overall progress', value: `${data.preparationProgress ?? 0}%`, icon: Target, color: '#4361ee' },
    { label: 'Study time', value: data.studyHours === null ? '—' : `${data.studyHours ?? 0}h`, icon: Clock3, color: '#16a34a' },
    { label: 'Mock tests', value: data.mockTestsTaken ?? 0, icon: Trophy, color: '#f59e0b' },
    { label: 'Average accuracy', value: `${data.averageAccuracy ?? 0}%`, icon: Target, color: '#a855f7' },
  ] : []

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1440, mx: 'auto' }}>
      <Typography variant="h4">Performance Analytics</Typography>
      <Typography color="text.secondary" sx={{ mt: 0.5, mb: 3 }}>
        Your results and progress recorded by ExamPro.
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {status === 'loading' && !data ? (
        <Box sx={{ py: 8, display: 'grid', placeItems: 'center' }}><CircularProgress /></Box>
      ) : data ? (
        <>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }, gap: 2, mb: 2 }}>
            {summaryCards.map(({ label, value, icon: Icon, color }) => (
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

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: 'repeat(2, 1fr)' }, gap: 2 }}>
            <Card>
              <CardContent sx={{ p: 2.5 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>Performance trend</Typography>
                {data.weeklyPerformance?.length ? (
                  <Stack spacing={1.5}>
                    {data.weeklyPerformance.map((item) => (
                      <Box key={item.label}>
                        <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                          <Typography variant="body2">{item.label}</Typography>
                          <Typography variant="body2" fontWeight={800}>{item.score}%</Typography>
                        </Stack>
                        <LinearProgress variant="determinate" value={item.score} />
                      </Box>
                    ))}
                  </Stack>
                ) : <EmptyMessage>Complete a mock test to see your performance trend.</EmptyMessage>}
              </CardContent>
            </Card>

            <Card>
              <CardContent sx={{ p: 2.5 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>Subject accuracy</Typography>
                {data.subjectAccuracy?.length ? (
                  <Stack spacing={1.5}>
                    {data.subjectAccuracy.map((item) => (
                      <Box key={item.subject}>
                        <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                          <Typography variant="body2">{item.subject}</Typography>
                          <Typography variant="body2" fontWeight={800}>{item.accuracy}%</Typography>
                        </Stack>
                        <LinearProgress variant="determinate" value={item.accuracy} />
                      </Box>
                    ))}
                  </Stack>
                ) : <EmptyMessage>Subject accuracy will appear after results are available.</EmptyMessage>}
              </CardContent>
            </Card>

            <Card>
              <CardContent sx={{ p: 2.5 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>Topics to review</Typography>
                {data.topicAccuracy?.length ? (
                  <Stack spacing={1.25}>
                    {data.topicAccuracy.map((item) => (
                      <Stack key={item.topic} direction="row" justifyContent="space-between">
                        <Typography variant="body2">{item.topic}</Typography>
                        <Chip label={`${item.accuracy}%`} size="small" variant="outlined" />
                      </Stack>
                    ))}
                  </Stack>
                ) : <EmptyMessage>Topic insights will appear when question-level results are available.</EmptyMessage>}
              </CardContent>
            </Card>

            <Card>
              <CardContent sx={{ p: 2.5 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>Recommended actions</Typography>
                {data.recommendations?.length ? (
                  <Stack spacing={1.5}>
                    {data.recommendations.map((item) => (
                      <Box key={item.id}>
                        <Typography fontWeight={800}>{item.title}</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>{item.detail}</Typography>
                        <Button size="small" endIcon={<ArrowRight size={15} />} onClick={() => navigate(item.route)}>{item.action}</Button>
                      </Box>
                    ))}
                  </Stack>
                ) : <EmptyMessage>There are no recommendations yet.</EmptyMessage>}
              </CardContent>
            </Card>
          </Box>
        </>
      ) : null}
    </Box>
  )
}
