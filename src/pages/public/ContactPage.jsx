import { useState } from 'react'
import { Alert, Box, Button, Container, TextField, Typography } from '@mui/material'

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)

  return (
    <Container maxWidth="sm" sx={{ py: { xs: 5, md: 8 } }}>
      <Typography variant="h4" color="primary">Contact ExamPro</Typography>
      <Typography color="text.secondary" sx={{ mt: 1, mb: 3 }}>
        Send support, course or examination enquiries to the platform team.
      </Typography>
      {submitted && <Alert severity="success" sx={{ mb: 2 }}>Your message has been recorded.</Alert>}
      <Box
        component="form"
        onSubmit={(event) => {
          event.preventDefault()
          setSubmitted(true)
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
