import { Box, Button, Container, TextField, Typography } from '@mui/material'
import { useAppFeedback } from '../../hooks/useAppFeedback'

export default function ContactPage() {
  const { showToast } = useAppFeedback()

  return (
    <Container maxWidth="sm" sx={{ py: { xs: 5, md: 8 } }}>
      <Typography variant="h4" color="primary">Contact ExamPro</Typography>
      <Typography color="text.secondary" sx={{ mt: 1, mb: 3 }}>
        Send support, course or examination enquiries to the platform team.
      </Typography>
      <Box
        component="form"
        onSubmit={(event) => {
          event.preventDefault()
          showToast('Your message has been recorded.')
        }}
        sx={{ display: 'grid', gap: 2 }}
      >
        <TextField label="Name" required />
        <TextField label="Email" type="email" required />
        <TextField label="Message" multiline minRows={5} required />
        <Button type="submit" variant="contained" sx={{ justifySelf: 'start' }}>Send message</Button>
      </Box>
    </Container>
  )
}
