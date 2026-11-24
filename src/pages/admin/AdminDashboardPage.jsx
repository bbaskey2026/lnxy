import { Avatar, Box, Card, CardContent, Chip, Stack, Typography } from '@mui/material'
import { useSelector } from 'react-redux'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { BookOpen, GraduationCap, IndianRupee, Users } from 'lucide-react'

export default function AdminDashboardPage() {
  const admin = useSelector((state) => state.admin)
  const summary = [
    { label: 'Total students', value: '18,420', icon: Users, color: '#4361ee' },
    { label: 'Active courses', value: admin.courses.length, icon: BookOpen, color: '#16a34a' },
    { label: 'Examinations', value: admin.examinations.length, icon: GraduationCap, color: '#f59e0b' },
    { label: 'Monthly revenue', value: '₹4.8L', icon: IndianRupee, color: '#a855f7' },
  ]
  const growth = [
    { month: 'Jul', users: 820 },
    { month: 'Aug', users: 1040 },
    { month: 'Sep', users: 1230 },
    { month: 'Oct', users: 1480 },
    { month: 'Nov', users: 1720 },
  ]
  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1440, mx: 'auto' }}>
      <Typography variant="h4">Admin Overview</Typography>
      <Typography color="text.secondary" sx={{ mt: 0.5, mb: 3 }}>Platform performance and management summary.</Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }, gap: 2, mb: 2 }}>
        {summary.map(({ label, value, icon: Icon, color }) => (
          <Card key={label}><CardContent sx={{ p: 2.25 }}><Stack direction="row" justifyContent="space-between"><Box><Typography variant="body2" color="text.secondary">{label}</Typography><Typography variant="h5" sx={{ mt: 0.75 }}>{value}</Typography></Box><Avatar variant="rounded" sx={{ bgcolor: `${color}14`, color }}>{<Icon size={20} />}</Avatar></Stack></CardContent></Card>
        ))}
      </Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1.4fr .6fr' }, gap: 2 }}>
        <Card><CardContent sx={{ p: 2.5 }}><Typography variant="h6" sx={{ mb: 2 }}>Student growth</Typography><Box sx={{ height: 300 }}><ResponsiveContainer width="100%" height="100%"><BarChart data={growth}><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#edf0f5" /><XAxis dataKey="month" axisLine={false} tickLine={false} /><YAxis axisLine={false} tickLine={false} /><Tooltip /><Bar dataKey="users" fill="#4361ee" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer></Box></CardContent></Card>
        <Card><CardContent sx={{ p: 2.5 }}><Typography variant="h6" sx={{ mb: 2 }}>Pending actions</Typography><Stack spacing={1.5}><Chip label="3 courses awaiting review" /><Chip label="5 materials need approval" /><Chip label="2 exam patterns pending" /></Stack></CardContent></Card>
      </Box>
    </Box>
  )
}
