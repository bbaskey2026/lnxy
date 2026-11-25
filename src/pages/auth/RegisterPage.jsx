import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Formik } from 'formik'
import * as Yup from 'yup'
import { Box, Button, Card, Container, IconButton, InputAdornment, TextField, Typography } from '@mui/material'
import { ArrowRight, Eye, EyeOff, GraduationCap, ShieldCheck } from 'lucide-react'
import { useAppFeedback } from '../../hooks/useAppFeedback'
import { register } from '../../store/slices/authSlice'

const authFieldSx = {
  '& .MuiOutlinedInput-root': { borderRadius: 0 },
  '& .MuiOutlinedInput-root.Mui-focused fieldset': { borderColor: '#0b5cff' },
  '& .MuiInputLabel-root.Mui-focused': { color: '#c2410c' },
}

const validationSchema = Yup.object({
  name: Yup.string().trim().min(2, 'Enter your full name').required('Full name is required'),
  email: Yup.string().email('Enter a valid email address').required('Email is required'),
  password: Yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
})

export default function RegisterPage() {
  const [visiblePasswords, setVisiblePasswords] = useState({
    password: false,
    confirmPassword: false,
  })
  const dispatch = useDispatch()
  const navigate = useNavigate()
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
                <Typography variant="overline" sx={{ fontWeight: 800, letterSpacing: '.12em' }}>A FRESH START</Typography>
              </Box>
              <Typography component="h1" sx={{ maxWidth: 360, fontSize: { xs: 28, md: 36 }, lineHeight: 1.12, letterSpacing: '-.04em', fontWeight: 800 }}>
                Make your next goal happen.
              </Typography>
              <Typography sx={{ mt: 2, maxWidth: 340, color: 'rgba(255,255,255,.82)', lineHeight: 1.75 }}>
                Build a study routine that works for you, one focused session at a time.
              </Typography>
            </Box>
            <Box sx={{ position: 'relative', display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1.25, color: 'rgba(255,255,255,.88)' }}>
              <ShieldCheck size={19} />
              <Typography variant="body2">Your preparation, organized in one place</Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', p: { xs: 3, sm: 4, md: 6 } }}>
            <Box sx={{ width: '100%', maxWidth: 420, mx: 'auto' }}>
              <Typography component="h2" sx={{ fontSize: 24, fontWeight: 800, letterSpacing: '-.03em', color: '#1f2937' }}>
                Create your account
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 3 }}>
                Start your preparation journey with ExamPro.
              </Typography>
              <Formik
                initialValues={{ name: '', email: '', password: '', confirmPassword: '' }}
                validationSchema={validationSchema}
                onSubmit={async (values) => {
                  const result = await dispatch(register(values))
                  if (register.fulfilled.match(result)) {
                    showToast('Your account was created successfully.')
                    navigate('/student/dashboard', { replace: true })
                  } else {
                    showToast(result.payload ?? result.error?.message ?? 'Unable to create your account.', 'error')
                  }
                }}
              >
                {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
                  <Box component="form" onSubmit={handleSubmit} noValidate sx={{ display: 'grid', gap: 2 }}>
                    {[
                      { name: 'name', label: 'Full name', type: 'text', autoComplete: 'name' },
                      { name: 'email', label: 'Email', type: 'email', autoComplete: 'email' },
                      { name: 'password', label: 'Password', type: 'password', autoComplete: 'new-password' },
                      { name: 'confirmPassword', label: 'Confirm password', type: 'password', autoComplete: 'new-password' },
                    ].map((field) => (
                      <TextField
                        key={field.name}
                        name={field.name}
                        label={field.label}
                        type={visiblePasswords[field.name] ? 'text' : field.type}
                        autoComplete={field.autoComplete}
                        fullWidth
                        sx={authFieldSx}
                        slotProps={{
                          input: field.type === 'password'
                            ? {
                                endAdornment: (
                                  <InputAdornment position="end">
                                    <IconButton
                                      aria-label={visiblePasswords[field.name] ? `Hide ${field.label.toLowerCase()}` : `Show ${field.label.toLowerCase()}`}
                                      aria-pressed={visiblePasswords[field.name]}
                                      edge="end"
                                      onClick={() => setVisiblePasswords((visible) => ({
                                        ...visible,
                                        [field.name]: !visible[field.name],
                                      }))}
                                    >
                                      {visiblePasswords[field.name] ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </IconButton>
                                  </InputAdornment>
                                ),
                              }
                            : undefined,
                        }}
                        value={values[field.name]}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched[field.name] && Boolean(errors[field.name])}
                        helperText={touched[field.name] && errors[field.name]}
                      />
                    ))}
                    <Button
                      type="submit"
                      variant="contained"
                      endIcon={<ArrowRight size={18} />}
                      disabled={status === 'loading' || isSubmitting}
                      sx={{ mt: 0.5, py: 1.35, borderRadius: 0, bgcolor: '#0b5cff', '&:hover': { bgcolor: '#0847c6' } }}
                    >
                      {status === 'loading' ? 'Creating account...' : 'Create account'}
                    </Button>
                    <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mt: 0.5 }}>
                      Already have an account?{' '}
                      <Button component={RouterLink} to="/login" variant="text" sx={{ minWidth: 0, p: 0, color: 'primary.main', verticalAlign: 'baseline', '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' } }}>
                        Sign in
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
