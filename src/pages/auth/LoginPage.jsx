import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Formik } from 'formik'
import * as Yup from 'yup'
import { Alert, Box, Button, Card, Container, IconButton, InputAdornment, TextField, Typography } from '@mui/material'
import { ArrowRight, Eye, EyeOff, GraduationCap, ShieldCheck } from 'lucide-react'
import { useAppFeedback } from '../../hooks/useAppFeedback'
import { login } from '../../store/slices/authSlice'

const authFieldSx = {
  '& .MuiOutlinedInput-root': { borderRadius: 0 },
  '& .MuiOutlinedInput-root.Mui-focused fieldset': { borderColor: '#0b5cff' },
  '& .MuiInputLabel-root.Mui-focused': { color: '#c2410c' },
}

const validationSchema = Yup.object({
  email: Yup.string().email('Enter a valid email address').required('Email is required'),
  password: Yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
})

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { status } = useSelector((state) => state.auth)
  const { showToast } = useAppFeedback()

  return (
    <Box
      sx={{
        minHeight: '100dvh',
        display: 'grid',
        placeItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        p: { xs: 2, sm: 3, md: 5 },
        background: 'linear-gradient(135deg, #f8fafc 0%, #eef2f8 100%)',
        '& .MuiButton-root, & .MuiAlert-root': { borderRadius: 0 },
      }}
    >
      <Box aria-hidden="true" sx={{ position: 'absolute', width: 1, height: 112, bgcolor: 'rgba(31,45,103,.08)', top: 0, right: { xs: 48, md: 120 } }} />
      <Box aria-hidden="true" sx={{ position: 'absolute', width: 112, height: 1, bgcolor: 'rgba(31,45,103,.08)', bottom: 56, left: 0 }} />
      <Container maxWidth="md" sx={{ zIndex: 1 }}>
        <Card
          sx={{
            width: '100%',
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '0.92fr 1.08fr' },
            overflow: 'hidden',
            border: 'none',
            borderRadius: 0,
            boxShadow: '0 28px 80px rgba(31, 45, 103, .14)',
          }}
        >
          <Box
            sx={{
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: { xs: 210, md: 590 },
              p: { xs: 3, sm: 4, md: 5 },
              color: 'white',
              background: 'linear-gradient(155deg, #111111 0%, #232323 60%, #0b5cff 100%)',
            }}
          >
            <Box aria-hidden="true" sx={{ position: 'absolute', width: 1, height: 160, bgcolor: 'rgba(255,255,255,.12)', right: 42, top: 0 }} />
            <Box aria-hidden="true" sx={{ position: 'absolute', width: 120, height: 1, bgcolor: 'rgba(255,255,255,.12)', right: 0, bottom: 78 }} />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, position: 'relative' }}>
              <Box sx={{ width: 42, height: 42, display: 'grid', placeItems: 'center', borderRadius: 0, bgcolor: 'rgba(255,255,255,.14)' }}>
                <GraduationCap size={24} />
              </Box>
              <Typography variant="h6" sx={{ color: 'white', letterSpacing: '-.02em' }}>ExamPro</Typography>
            </Box>
            <Box sx={{ position: 'relative', mt: { xs: 4, md: 0 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, color: '#dbe4ff' }}>
                <Typography variant="overline" sx={{ fontWeight: 800, letterSpacing: '.12em' }}>YOUR NEXT CHAPTER</Typography>
              </Box>
              <Typography component="h1" sx={{ maxWidth: 360, fontSize: { xs: 28, md: 36 }, lineHeight: 1.12, letterSpacing: '-.04em', fontWeight: 800 }}>
                Good to see you again.
              </Typography>
              <Typography sx={{ mt: 2, maxWidth: 340, color: 'rgba(255,255,255,.82)', lineHeight: 1.75 }}>
                Pick up where you left off and keep moving closer to your goals.
              </Typography>
            </Box>
            <Box sx={{ position: 'relative', display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1.25, color: 'rgba(255,255,255,.88)' }}>
              <ShieldCheck size={19} />
              <Typography variant="body2">A focused space for your exam preparation</Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', p: { xs: 3, sm: 4, md: 6 } }}>
            <Box sx={{ width: '100%', maxWidth: 420, mx: 'auto' }}>
              <Typography component="h2" sx={{ fontSize: 24, fontWeight: 800, letterSpacing: '-.03em', color: '#1f2937' }}>
                Welcome back
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 3.5 }}>
                Sign in to continue your preparation.
              </Typography>
              {location.state?.from && (
                <Alert severity="info" sx={{ mb: 2 }}>Please log in first to access this content.</Alert>
              )}
              <Formik
                initialValues={{ email: '', password: '' }}
                validationSchema={validationSchema}
                onSubmit={async (values) => {
                  const result = await dispatch(login(values))
                  if (login.fulfilled.match(result)) {
                    showToast('Signed in successfully.')
                    const role = result.payload.role
                    const destination = role === 'admin'
                      ? '/admin/dashboard'
                      : role === 'instructor'
                        ? '/student/dashboard'
                        : (location.state?.from ?? '/student/dashboard')
                    navigate(destination, { replace: true })
                  } else {
                    showToast(result.payload ?? result.error?.message ?? 'Unable to sign in.', 'error')
                  }
                }}
              >
                {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
                  <Box component="form" onSubmit={handleSubmit} noValidate sx={{ display: 'grid', gap: 2 }}>
                    <TextField
                      name="email"
                      label="Email"
                      type="email"
                      autoComplete="email"
                      fullWidth
                      sx={authFieldSx}
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.email && Boolean(errors.email)}
                      helperText={touched.email && errors.email}
                    />
                    <TextField
                      name="password"
                      label="Password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      fullWidth
                      sx={authFieldSx}
                      slotProps={{
                        input: {
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                                aria-pressed={showPassword}
                                edge="end"
                                onClick={() => setShowPassword((visible) => !visible)}
                              >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        },
                      }}
                      value={values.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.password && Boolean(errors.password)}
                      helperText={touched.password && errors.password}
                    />
                    <Button
                      type="submit"
                      variant="contained"
                      endIcon={<ArrowRight size={18} />}
                      disabled={status === 'loading' || isSubmitting}
                      sx={{ mt: 0.5, py: 1.35, borderRadius: 0, bgcolor: '#0b5cff', '&:hover': { bgcolor: '#0847c6' } }}
                    >
                      {status === 'loading' ? 'Signing in...' : 'Sign in'}
                    </Button>
                    <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mt: 1 }}>
                      New to ExamPro?{' '}
                      <Button component={RouterLink} to="/register" variant="text" sx={{ minWidth: 0, p: 0, color: 'primary.main', verticalAlign: 'baseline', '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' } }}>
                        Create an account
                      </Button>
                    </Typography>
                  </Box>
                )}
              </Formik>
            </Box>
          </Box>
        </Card>
      </Container>
    </Box>
  )
}
