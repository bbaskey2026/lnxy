import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  Stack,
  Tab,
  Tabs,
  Typography,
} from '@mui/material'
import { ArrowRight, Clock3, Target, TrendingUp, Trophy } from 'lucide-react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { setAnalyticsPeriod } from '../../store/slices/analyticsSlice'

export default function AnalyticsPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const analytics = useSelector((state) => state.analytics)
  const trend = analytics.period === 'monthly'
    ? analytics.monthlyPerformance
    : analytics.weeklyPerformance

  const summaryCards = [
    { label: 'Overall progress', value: `${analytics.preparationProgress}%`, icon: Target, color: '#4361ee' },
    { label: 'Study time', value: `${analytics.studyHours}h`, icon: Clock3, color: '#16a34a' },
    { label: 'Mock tests', value: analytics.mockTestsTaken, icon: Trophy, color: '#f59e0b' },
    { label: 'Weekly improvement', value: '+8.2%', icon: TrendingUp, color: '#a855f7' },
  ]

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1440, mx: 'auto' }}>
      <Typography variant="h4">Performance Analytics</Typography>
      <Typography color="text.secondary" sx={{ mt: 0.5, mb: 3 }}>Understand progress and focus on the topics that need attention.</Typography>

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

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 1.5fr) minmax(300px, .75fr)' }, gap: 2 }}>
        <Card>
          <CardContent sx={{ p: 2.5 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
              <Box>
                <Typography variant="h6">Performance trend</Typography>
                <Typography variant="caption" color="text.secondary">Average test score and study time</Typography>
              </Box>
            </Stack>
            <Tabs
              value={analytics.period}
              onChange={(_, value) => dispatch(setAnalyticsPeriod(value))}
              sx={{ mb: 1, minHeight: 40, '& .MuiTab-root': { minHeight: 40 } }}
            >
              <Tab value="weekly" label="This week" />
              <Tab value="monthly" label="This month" />
            </Tabs>
            <Box sx={{ height: 280 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trend} margin={{ top: 10, right: 10, left: -18, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#edf0f5" />
                  <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: '#667085', fontSize: 12 }} />
                  <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fill: '#667085', fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="score" name="Score %" stroke="#4361ee" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>

        <Card>
          <CardContent sx={{ p: 2.5 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Preparation progress</Typography>
            <Box sx={{ width: 170, height: 170, mx: 'auto', mb: 2, borderRadius: '50%', background: `conic-gradient(#4361ee 0 ${analytics.preparationProgress}%, #edf0f5 ${analytics.preparationProgress}% 100%)`, display: 'grid', placeItems: 'center' }}>
              <Box sx={{ width: 132, height: 132, borderRadius: '50%', bgcolor: 'white', display: 'grid', placeItems: 'center', textAlign: 'center' }}>
                <Box>
                  <Typography variant="h4">{analytics.preparationProgress}%</Typography>
                  <Typography variant="caption" color="text.secondary">overall</Typography>
                </Box>
              </Box>
            </Box>
            <Stack spacing={1.5}>
              <Stack direction="row" justifyContent="space-between"><Typography variant="body2" color="text.secondary">Strong topics</Typography><Typography fontWeight={800}>{analytics.strongTopics.length}</Typography></Stack>
              <Stack direction="row" justifyContent="space-between"><Typography variant="body2" color="text.secondary">Weak topics</Typography><Typography fontWeight={800}>{analytics.weakTopics.length}</Typography></Stack>
              <Stack direction="row" justifyContent="space-between"><Typography variant="body2" color="text.secondary">Study consistency</Typography><Typography fontWeight={800}>6/7 days</Typography></Stack>
            </Stack>
          </CardContent>
        </Card>

        <Card>
          <CardContent sx={{ p: 2.5 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Subject-wise accuracy</Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.subjectAccuracy} layout="vertical" margin={{ top: 0, right: 20, left: 20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#edf0f5" />
                  <XAxis type="number" domain={[0, 100]} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="subject" width={135} axisLine={false} tickLine={false} tick={{ fill: '#667085', fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="accuracy" name="Accuracy %" fill="#4361ee" radius={[0, 6, 6, 0]} barSize={18} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>

        <Card>
          <CardContent sx={{ p: 2.5 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Topic accuracy</Typography>
            <Stack spacing={1.75}>
              {analytics.topicAccuracy.map((item) => (
                <Box key={item.topic}>
                  <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.75 }}>
                    <Typography variant="body2" fontWeight={700}>{item.topic}</Typography>
                    <Typography variant="body2" fontWeight={800}>{item.accuracy}%</Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={item.accuracy}
                    sx={{
                      height: 7,
                      borderRadius: 99,
                      '& .MuiLinearProgress-bar': { bgcolor: item.accuracy < 65 ? '#dc2626' : item.accuracy < 75 ? '#f59e0b' : '#16a34a' },
                    }}
                  />
                </Box>
              ))}
            </Stack>
          </CardContent>
        </Card>

        <Card sx={{ lg: { gridColumn: '1 / -1' } }}>
          <CardContent sx={{ p: 2.5 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Recommended Actions</Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 2 }}>
              {analytics.recommendations.map((item) => (
                <Box key={item.id} sx={{ p: 2, border: '1px solid #edf0f5', borderRadius: 2.5 }}>
                  <Chip label="Based on performance" size="small" variant="outlined" color="primary" />
                  <Typography variant="body1" fontWeight={800} sx={{ mt: 1.5 }}>{item.title}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 1.5 }}>{item.detail}</Typography>
                  <Button size="small" endIcon={<ArrowRight size={15} />} onClick={() => navigate(item.route)}>{item.action}</Button>
                </Box>
              ))}
            </Box>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 2.5 }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" fontWeight={800} color="success.main" sx={{ mb: 1 }}>Strong topics</Typography>
                <Stack direction="row" flexWrap="wrap" gap={1}>
                  {analytics.strongTopics.map((topic) => <Chip key={topic} label={topic} size="small" color="success" variant="outlined" />)}
                </Stack>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" fontWeight={800} color="error.main" sx={{ mb: 1 }}>Needs improvement</Typography>
                <Stack direction="row" flexWrap="wrap" gap={1}>
                  {analytics.weakTopics.map((topic) => <Chip key={topic} label={topic} size="small" color="error" variant="outlined" />)}
                </Stack>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Box>
    </Box>
  )
}
