import { useDispatch, useSelector } from 'react-redux'
import { Formik } from 'formik'
import * as Yup from 'yup'
import { Alert, Box, Button, Card, TextField, Typography } from '@mui/material'
import { setAuthenticatedUser } from '../../store/slices/authSlice'
import { setProfile } from '../../store/slices/userSlice'

const schema = Yup.object({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Enter a valid email').required('Email is required'),
  targetExam: Yup.string().required('Target examination is required'),
})

export default function ProfilePage() {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.auth.currentUser)
  const profile = useSelector((state) => state.user.profile)

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 760, mx: 'auto' }}>
      <Card sx={{ p: { xs: 2.5, md: 4 } }}>
        <Typography variant="h5" gutterBottom>Student profile</Typography>
        <Formik
          initialValues={{
            name: user?.name ?? '',
            email: user?.email ?? '',
            targetExam: profile?.targetExam ?? '',
          }}
          validationSchema={schema}
          onSubmit={(values, helpers) => {
            dispatch(setAuthenticatedUser({ ...user, name: values.name, email: values.email }))
            dispatch(setProfile(values))
            helpers.setSubmitting(false)
          }}
        >
          {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting, submitCount }) => (
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ display: 'grid', gap: 2 }}>
              {submitCount > 0 && !Object.keys(errors).length && <Alert severity="success">Profile updated successfully.</Alert>}
              {[
                { name: 'name', label: 'Full name' },
                { name: 'email', label: 'Email', type: 'email' },
                { name: 'targetExam', label: 'Target examination' },
              ].map((field) => (
                <TextField
                  key={field.name}
                  name={field.name}
                  label={field.label}
                  type={field.type ?? 'text'}
                  value={values[field.name]}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched[field.name] && Boolean(errors[field.name])}
                  helperText={touched[field.name] && errors[field.name]}
                />
              ))}
              <Button type="submit" variant="contained" disabled={isSubmitting} sx={{ justifySelf: 'start' }}>
                Save profile
              </Button>
            </Box>
          )}
        </Formik>
      </Card>
    </Box>
  )
}
