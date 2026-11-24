import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Formik } from 'formik'
import * as Yup from 'yup'
import { Alert, Box, Button, Card, Container, TextField, Typography } from '@mui/material'
import { register } from '../../store/slices/authSlice'

const validationSchema = Yup.object({
  name: Yup.string().trim().min(2, 'Enter your full name').required('Full name is required'),
  email: Yup.string().email('Enter a valid email address').required('Email is required'),
  password: Yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
})

export default function RegisterPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { status, error } = useSelector((state) => state.auth)

  return (
    <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center', bgcolor: 'background.default', p: 2 }}>
      <Container maxWidth="xs">
        <Card sx={{ p: 4 }}>
          <Typography variant="h5" color="primary" gutterBottom>Create your account</Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Formik
            initialValues={{ name: '', email: '', password: '', confirmPassword: '' }}
            validationSchema={validationSchema}
            onSubmit={async (values) => {
              const result = await dispatch(register(values))
              if (register.fulfilled.match(result)) navigate('/student/dashboard', { replace: true })
            }}
          >
            {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
              <Box component="form" onSubmit={handleSubmit} noValidate sx={{ display: 'grid', gap: 2, mt: 2 }}>
                {[
                  { name: 'name', label: 'Full name', type: 'text' },
                  { name: 'email', label: 'Email', type: 'email' },
                  { name: 'password', label: 'Password', type: 'password' },
                  { name: 'confirmPassword', label: 'Confirm password', type: 'password' },
                ].map((field) => (
                  <TextField
                    key={field.name}
                    name={field.name}
                    label={field.label}
                    type={field.type}
                    fullWidth
                    value={values[field.name]}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched[field.name] && Boolean(errors[field.name])}
                    helperText={touched[field.name] && errors[field.name]}
                  />
                ))}
                <Button type="submit" variant="contained" disabled={status === 'loading' || isSubmitting}>
                  {status === 'loading' ? 'Creating account...' : 'Create account'}
                </Button>
                <Button component={RouterLink} to="/login">Already have an account?</Button>
              </Box>
            )}
          </Formik>
        </Card>
      </Container>
    </Box>
  )
}
