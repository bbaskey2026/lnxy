import { Box, Button, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'

export default function NotFoundPage() {
  const navigate = useNavigate()
  return (
    <Box sx={{ minHeight: '70vh', display: 'grid', placeItems: 'center', textAlign: 'center', p: 3 }}>
      <Box>
        <Typography variant="h2" color="primary">404</Typography>
        <Typography variant="h5" sx={{ mt: 1 }}>Page not found</Typography>
        <Typography color="text.secondary" sx={{ mt: 1, mb: 3 }}>
          This module is not available yet or the address is incorrect.
        </Typography>
        <Button variant="contained" onClick={() => navigate('/student/dashboard')}>Return to dashboard</Button>
      </Box>
    </Box>
  )
}
