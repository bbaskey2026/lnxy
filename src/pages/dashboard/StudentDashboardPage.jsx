import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  Alert,
  Stack,
  Typography,
} from '@mui/material'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  BookOpen,
  Clock3,
  Target,
  Trophy,
  CalendarDays,
  CheckCircle2,
  Download,
  PlayCircle,
} from 'lucide-react'
import { fetchDashboard } from '../../store/slices/dashboardSlice'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

const performance = [
  { day: 'Mon', score: 48 },
  { day: 'Tue', score: 55 },
  { day: 'Wed', score: 52 },
  { day: 'Thu', score: 67 },
  { day: 'Fri', score: 63 },
  { day: 'Sat', score: 74 },
  { day: 'Sun', score: 82 },
]

const stats = [
  { label: 'Study hours', value: '42.5h', detail: '+6.2h this week', icon: Clock3, color: '#4361ee' },
  { label: 'Lectures completed', value: '28', detail: 'of 42 lectures', icon: BookOpen, color: '#16a34a' },
  { label: 'Mock tests', value: '12', detail: '3 attempted this week', icon: Trophy, color: '#f59e0b' },
  { label: 'Average score', value: '78%', detail: '+8% improvement', icon: Target, color: '#a855f7' },
]

function StatCard({ item }) {
  const Icon = item.icon
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: 2.25 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography variant="body2" color="text.secondary">{item.label}</Typography>
            <Typography variant="h5" sx={{ mt: 0.75 }}>{item.value}</Typography>
            <Typography variant="caption" color="success.main" sx={{ display: 'block', mt: 0.5 }}>{item.detail}</Typography>
          </Box>
          <Box sx={{ width: 42, height: 42, borderRadius: 2, bgcolor: `${item.color}14`, color: item.color, display: 'grid', placeItems: 'center' }}>
            <Icon size={20} />
          </Box>
        </Stack>
      </CardContent>
    </Card>
  )
}

export default function StudentDashboardPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const dashboard = useSelector((state) => state.dashboard)
  const currentUser = useSelector((state) => state.auth.currentUser)

  useEffect(() => {
    dispatch(fetchDashboard())
  }, [dispatch])

  const displayName = currentUser?.name?.split(' ')[0] ?? 'Aarav'

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1440, mx: 'auto' }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontSize: { xs: 26, md: 30 } }}>Good morning, {displayName}!</Typography>
          <Typography color="text.secondary" sx={{ mt: 0.5 }}>You are making great progress. Keep it up!</Typography>
        </Box>
        <Button
          variant="contained"
          onClick={() => navigate('/student/practice')}
          sx={{ mt: { xs: 2, sm: 0 }, alignSelf: { xs: 'stretch', sm: 'auto' } }}
        >
          Start Daily Quiz
        </Button>
      </Stack>

      {dashboard.status === 'failed' && (
        <Alert
          severity="error"
          action={<Button color="inherit" size="small" onClick={() => dispatch(fetchDashboard())}>Retry</Button>}
          sx={{ mb: 2 }}
        >
          {dashboard.error ?? 'Unable to load dashboard data.'}
        </Alert>
      )}

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }, gap: 2, mb: 2 }}>
        {stats.map((item) => <StatCard key={item.label} item={item} />)}
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 1.55fr) minmax(280px, .75fr)' }, gap: 2 }}>
        <Card>
          <CardContent sx={{ p: 2.5 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
              <Box>
                <Typography variant="h6">Weekly Performance</Typography>
                <Typography variant="caption" color="text.secondary">Average score trend</Typography>
              </Box>
              <Chip label="+12.4%" size="small" color="success" variant="outlined" />
            </Stack>
            <Box sx={{ height: 250 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={performance} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
                  <defs>
                    <linearGradient id="scoreFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4361ee" stopOpacity={0.28} />
                      <stop offset="95%" stopColor="#4361ee" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#edf0f5" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#667085', fontSize: 12 }} />
                  <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fill: '#667085', fontSize: 12 }} />
                  <Tooltip />
                  <Area type="monotone" dataKey="score" stroke="#4361ee" strokeWidth={3} fill="url(#scoreFill)" />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>

        <Card>
          <CardContent sx={{ p: 2.5 }}>
            <Typography variant="h6">Daily Study Goal</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>2h 15m of 3 hours</Typography>
            <Box sx={{ my: 3, position: 'relative', width: 148, height: 148, borderRadius: '50%', mx: 'auto', background: 'conic-gradient(#4361ee 0 75%, #edf0f5 75% 100%)', display: 'grid', placeItems: 'center' }}>
              <Box sx={{ width: 118, height: 118, borderRadius: '50%', bgcolor: 'white', display: 'grid', placeItems: 'center', textAlign: 'center' }}>
                <Box>
                  <Typography variant="h4">75%</Typography>
                  <Typography variant="caption" color="text.secondary">completed</Typography>
                </Box>
              </Box>
            </Box>
            <Button fullWidth variant="outlined" onClick={() => navigate('/student/analytics')}>View Study Plan</Button>
          </CardContent>
        </Card>

        <Card sx={{ lg: { gridColumn: '1 / -1' } }}>
          <CardContent sx={{ p: 2.5 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
              <Typography variant="h6">Continue Learning</Typography>
              <Button endIcon={<ArrowRight size={16} />} onClick={() => navigate('/student/courses')}>View all</Button>
            </Stack>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
              {[
                { title: 'Quantitative Aptitude', subtitle: 'Time & Work • Lesson 8', progress: 68, initials: 'QA' },
                { title: 'Indian Polity', subtitle: 'Fundamental Rights • Lesson 12', progress: 44, initials: 'IP' },
              ].map((course) => (
                <Box key={course.title} sx={{ p: 2, border: '1px solid #edf0f5', borderRadius: 2.5, display: 'flex', gap: 1.5, alignItems: 'center' }}>
                  <Avatar variant="rounded" sx={{ width: 54, height: 54, bgcolor: 'primary.light', color: 'primary.main', fontWeight: 800 }}>{course.initials}</Avatar>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography fontWeight={800} noWrap>{course.title}</Typography>
                    <Typography variant="caption" color="text.secondary">{course.subtitle}</Typography>
                    <Stack direction="row" alignItems="center" gap={1} sx={{ mt: 1 }}>
                      <LinearProgress variant="determinate" value={course.progress} sx={{ flex: 1, height: 6, borderRadius: 99 }} />
                      <Typography variant="caption" fontWeight={800}>{course.progress}%</Typography>
                    </Stack>
                  </Box>
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>

        <Card>
          <CardContent sx={{ p: 2.5 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
              <Typography variant="h6">Upcoming</Typography>
              <CalendarDays size={19} color="#4361ee" />
            </Stack>
            <Stack spacing={1}>
              {dashboard.upcomingExams.map((exam) => (
                <Box key={exam.id} sx={{ p: 1.5, border: '1px solid #edf0f5', borderRadius: 2 }}>
                  <Stack direction="row" justifyContent="space-between" gap={1}>
                    <Box>
                      <Typography variant="body2" fontWeight={800}>{exam.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {exam.type} • {new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short' }).format(new Date(`${exam.date}T00:00:00`))}
                      </Typography>
                    </Box>
                    <Chip label={`${exam.daysLeft} days`} size="small" color="primary" variant="outlined" />
                  </Stack>
                </Box>
              ))}
            </Stack>
          </CardContent>
        </Card>

        <Card>
          <CardContent sx={{ p: 2.5 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Enrolled Examinations</Typography>
            <Stack spacing={2}>
              {dashboard.enrolledExams.map((exam) => (
                <Box key={exam.id}>
                  <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.75 }}>
                    <Typography variant="body2" fontWeight={800}>{exam.name}</Typography>
                    <Typography variant="caption" fontWeight={800}>{exam.progress}%</Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={exam.progress}
                    sx={{ height: 7, borderRadius: 99, '& .MuiLinearProgress-bar': { bgcolor: exam.color } }}
                  />
                </Box>
              ))}
            </Stack>
            <Button fullWidth variant="text" sx={{ mt: 2 }} onClick={() => navigate('/exams')}>Browse examinations</Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent sx={{ p: 2.5 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Recent Activity</Typography>
            <Stack spacing={1.5}>
              {dashboard.recentActivities.map((activity) => (
                <Stack key={activity.id} direction="row" spacing={1.25} alignItems="center">
                  <Box sx={{ width: 38, height: 38, borderRadius: '50%', bgcolor: '#eef4ff', color: '#4361ee', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                    {activity.kind === 'test' ? <Trophy size={17} /> : activity.kind === 'material' ? <Download size={17} /> : <CheckCircle2 size={17} />}
                  </Box>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography variant="body2" fontWeight={800} noWrap>{activity.title}</Typography>
                    <Typography variant="caption" color="text.secondary">{activity.detail} • {activity.time}</Typography>
                  </Box>
                </Stack>
              ))}
            </Stack>
          </CardContent>
        </Card>

        <Card sx={{ lg: { gridColumn: '1 / -1' } }}>
          <CardContent sx={{ p: 2.5 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Recommended for You</Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 2 }}>
              {dashboard.recommendations.map((item) => (
                <Box key={item.id} sx={{ p: 2, border: '1px solid #edf0f5', borderRadius: 2.5 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start" gap={1}>
                    <Avatar variant="rounded" sx={{ width: 42, height: 42, bgcolor: 'primary.light', color: 'primary.main' }}>
                      {item.type === 'Video lecture' ? <PlayCircle size={20} /> : <BookOpen size={20} />}
                    </Avatar>
                    <Chip label={item.duration} size="small" variant="outlined" />
                  </Stack>
                  <Typography variant="body2" fontWeight={800} sx={{ mt: 1.5 }}>{item.title}</Typography>
                  <Typography variant="caption" color="text.secondary">{item.type}</Typography>
                  {item.progress > 0 && <LinearProgress variant="determinate" value={item.progress} sx={{ mt: 1.5, height: 5, borderRadius: 99 }} />}
                  <Button
                    size="small"
                    sx={{ mt: 1.5, p: 0 }}
                    onClick={() => navigate(item.type === 'Video lecture' ? '/student/courses' : '/student/study-materials')}
                  >
                    {item.progress > 0 ? 'Continue' : 'Start'}
                  </Button>
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  )
}
