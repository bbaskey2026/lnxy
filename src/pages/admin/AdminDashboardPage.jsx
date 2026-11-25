import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Alert, Avatar, Box, Button, Card, CardContent, CircularProgress, Stack, Typography } from '@mui/material'
import { BookOpen, FileText, GraduationCap, Users } from 'lucide-react'
import { fetchAdminOverview } from '../../store/slices/adminSlice'

export default function AdminDashboardPage() {
  const dispatch = useDispatch()
  const admin = useSelector((state) => state.admin)

  useEffect(() => {
    dispatch(fetchAdminOverview())
  }, [dispatch])

  const summary = [
    { label: 'Students', value: admin.users.filter((user) => user.role === 'student').length, icon: Users, color: '#4361ee' },
    { label: 'Courses', value: admin.courses.length, icon: BookOpen, color: '#16a34a' },
    { label: 'Examinations', value: admin.examinations.length, icon: GraduationCap, color: '#f59e0b' },
    { label: 'Study materials', value: admin.materials.length, icon: FileText, color: '#a855f7' },
  ]

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1440, mx: 'auto' }}>
      <Typography variant="h4">Admin Overview</Typography>
      <Typography color="text.secondary" sx={{ mt: 0.5, mb: 3 }}>Current totals from the platform API.</Typography>
      {admin.error && (
        <Alert
          severity="error"
          action={<Button color="inherit" size="small" onClick={() => dispatch(fetchAdminOverview())}>Retry</Button>}
          sx={{ mb: 2 }}
        >
          {admin.error}
        </Alert>
      )}
      {admin.loading ? (
        <Box sx={{ py: 8, display: 'grid', placeItems: 'center' }}><CircularProgress /></Box>
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }, gap: 2 }}>
          {summary.map(({ label, value, icon: Icon, color }) => (
            <Card key={label}>
              <CardContent sx={{ p: 2.25 }}>
                <Stack direction="row" justifyContent="space-between">
                  <Box>
                    <Typography variant="body2" color="text.secondary">{label}</Typography>
                    <Typography variant="h5" sx={{ mt: 0.75 }}>{value}</Typography>
                  </Box>
                  <Avatar variant="rounded" sx={{ bgcolor: `${color}14`, color }}>
                    <Icon size={20} />
                  </Avatar>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  )
}
