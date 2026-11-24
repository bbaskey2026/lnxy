import { Box, Container, Stack, Typography } from '@mui/material'
import { BarChart3, BookOpen, ClipboardCheck } from 'lucide-react'

export default function AboutPage() {
  const features = [
    { icon: BookOpen, title: 'Structured learning', text: 'Courses and resources organized around examination requirements.' },
    { icon: ClipboardCheck, title: 'Real practice', text: 'Timed mock tests, sectional practice and previous year papers.' },
    { icon: BarChart3, title: 'Useful analytics', text: 'Track accuracy, strong topics and areas that need revision.' },
  ]
  return (
    <Container maxWidth="lg" sx={{ py: { xs: 5, md: 8 } }}>
      <Typography variant="h3" color="primary" sx={{ mb: 2 }}>Prepare smarter, not harder.</Typography>
      <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 780, mb: 5, lineHeight: 1.7 }}>
        ExamPro brings learning resources, practice, mock examinations and performance insights into one focused platform.
      </Typography>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
        {features.map(({ icon: Icon, title, text }) => (
          <Box key={title} sx={{ flex: 1, p: 3, bgcolor: 'white', border: '1px solid #e9edf4', borderRadius: 3 }}>
            <Icon size={24} color="#4361ee" />
            <Typography variant="h6" sx={{ mt: 1.5 }}>{title}</Typography>
            <Typography color="text.secondary" sx={{ mt: 0.75 }}>{text}</Typography>
          </Box>
        ))}
      </Stack>
    </Container>
  )
}
