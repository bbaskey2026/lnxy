import { Component } from 'react'
import { Box, Button, Typography } from '@mui/material'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    console.error('Unhandled application error', error, info)
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center', textAlign: 'center', p: 3 }}>
        <Box>
          <Typography variant="h4" color="primary">Something went wrong</Typography>
          <Typography color="text.secondary" sx={{ mt: 1, mb: 3 }}>
            The page could not be rendered. Reload to start again.
          </Typography>
          <Button variant="contained" onClick={() => window.location.reload()}>Reload application</Button>
        </Box>
      </Box>
    )
  }
}
