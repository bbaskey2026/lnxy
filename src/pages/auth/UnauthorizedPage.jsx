import { Button, Container, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'

export default function UnauthorizedPage() {
  const navigate = useNavigate()
  return (
    <Container maxWidth="sm" sx={{ py: 12, textAlign: 'center' }}>
      <Typography variant="h3" color="primary">403</Typography>
      <Typography variant="h5" sx={{ mt: 1 }}>Access denied</Typography>
      <Typography color="text.secondary" sx={{ mt: 1, mb: 3 }}>
        Your account does not have permission to view this page.
      </Typography>
      <Button variant="contained" onClick={() => navigate('/student/dashboard')}>Go to dashboard</Button>
    </Container>
  )
}
