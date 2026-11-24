import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Formik } from 'formik'
import * as Yup from 'yup'
import { Alert, Box, Button, Card, Container, TextField, Typography } from '@mui/material'
import { login } from '../../store/slices/authSlice'

const validationSchema = Yup.object({
  email: Yup.string().email('Enter a valid email address').required('Email is required'),
  password: Yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
})

export default function LoginPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { status, error } = useSelector((state) => state.auth)

  return (
    <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center', bgcolor: 'background.default', p: 2 }}>
      <Container maxWidth="xs">
        <Card sx={{ p: 4 }}>
          <Typography variant="h5" color="primary" gutterBottom>Welcome back</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>Sign in to continue your preparation.</Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={validationSchema}
            onSubmit={async (values) => {
              const result = await dispatch(login(values))
              if (login.fulfilled.match(result)) {
                const role = result.payload.role
                const destination = role === 'admin'
                  ? '/admin/dashboard'
                  : role === 'instructor'
                    ? '/student/dashboard'
                    : (location.state?.from ?? '/student/dashboard')
                navigate(destination, { replace: true })
              }
            }}
          >
            {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
              <Box component="form" onSubmit={handleSubmit} noValidate sx={{ display: 'grid', gap: 2 }}>
                <TextField
                  name="email"
                  label="Email"
                  type="email"
                  fullWidth
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.email && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                />
                <TextField
                  name="password"
                  label="Password"
                  type="password"
                  fullWidth
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.password && Boolean(errors.password)}
                  helperText={touched.password && errors.password}
                />
                <Button type="submit" variant="contained" disabled={status === 'loading' || isSubmitting}>
                  {status === 'loading' ? 'Signing in...' : 'Sign in'}
                </Button>
                <Button component={RouterLink} to="/register">Create an account</Button>
              </Box>
            )}
          </Formik>
        </Card>
      </Container>
    </Box>
  )
}
