import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'
import { Plus } from 'lucide-react'
import {
  createAdminExam,
  fetchAdminSection,
  updateExaminationStatus,
  updateUserStatus,
} from '../../store/slices/adminSlice'

export default function AdminManagementPage({ section }) {
  const dispatch = useDispatch()
  const admin = useSelector((state) => state.admin)
  const [query, setQuery] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [actionError, setActionError] = useState('')
  const [draft, setDraft] = useState({ name: '', category: 'SSC Examinations' })

  const title = {
    exams: 'Examinations',
    courses: 'Courses',
    materials: 'Study materials',
    users: 'Users',
    reports: 'Reports',
  }[section] ?? 'Management'

  useEffect(() => {
    dispatch(fetchAdminSection(section))
  }, [dispatch, section])

  const rows = useMemo(() => {
    const source = section === 'exams'
      ? admin.examinations.map((exam) => ({
          ...exam,
          status: exam.isActive ? 'Active' : 'Draft',
        }))
      : section === 'courses'
        ? admin.courses.map((course) => ({
            ...course,
            name: course.title,
            instructor: course.instructorName ?? '',
            students: course.studentCount ?? 0,
            status: course.isPublished ? 'Published' : 'Draft',
          }))
        : section === 'users'
          ? admin.users.map((user) => ({
              ...user,
              status: (user.status ?? 'active').replace(/^./, (letter) => letter.toUpperCase()),
            }))
          : section === 'materials'
            ? admin.materials.map((material) => ({
                ...material,
                name: material.title,
                status: material.isPublished ? 'Published' : 'Draft',
              }))
            : []
    return source.filter((row) => `${row.name ?? ''} ${row.category ?? row.email ?? row.instructor ?? ''}`.toLowerCase().includes(query.toLowerCase()))
  }, [section, admin.examinations, admin.courses, admin.materials, admin.users, query])

  const saveExamination = async () => {
    setActionError('')
    try {
      await dispatch(createAdminExam(draft)).unwrap()
      setDraft({ name: '', category: 'SSC Examinations' })
      setDialogOpen(false)
    } catch (error) {
      setActionError(error)
    }
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1440, mx: 'auto' }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h4">{title}</Typography>
          <Typography color="text.secondary" sx={{ mt: 0.5 }}>Manage platform records from the backend.</Typography>
        </Box>
        {section === 'exams' && (
          <Button variant="contained" startIcon={<Plus size={17} />} onClick={() => setDialogOpen(true)} sx={{ mt: { xs: 2, sm: 0 } }}>
            Add examination
          </Button>
        )}
      </Stack>
      {(admin.error || actionError) && <Alert severity="error" sx={{ mb: 2 }}>{actionError || admin.error}</Alert>}
      {section !== 'reports' && (
        <TextField
          size="small"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={`Search ${title.toLowerCase()}`}
          sx={{ mb: 2, width: { xs: '100%', sm: 320 }, bgcolor: 'white' }}
        />
      )}
      {admin.sectionLoading ? (
        <Box sx={{ py: 8, display: 'grid', placeItems: 'center' }}><CircularProgress /></Box>
      ) : section === 'reports' ? (
        <Alert severity="info">Report data is not available from the backend yet.</Alert>
      ) : (
        <Box sx={{ bgcolor: 'white', border: '1px solid #e9edf4', borderRadius: 2.5, overflowX: 'auto' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>{section === 'users' ? 'Email / Role' : 'Category / Details'}</TableCell>
                <TableCell>Status</TableCell>
                {section === 'exams' && <TableCell align="right">Action</TableCell>}
                {section === 'users' && <TableCell align="right">Action</TableCell>}
                {section === 'courses' && <TableCell align="right">Students</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell sx={{ fontWeight: 800 }}>{row.name ?? row.title}</TableCell>
                  <TableCell>
                    {section === 'users' ? (
                      <><Typography variant="body2">{row.email}</Typography><Typography variant="caption" color="text.secondary">{row.role}</Typography></>
                    ) : (
                      <Typography variant="body2" color="text.secondary">{row.category ?? row.instructor ?? row.description ?? ''}</Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    {section === 'exams' ? (
                      <Chip label={row.status} size="small" color={row.isActive ? 'success' : 'default'} variant="outlined" />
                    ) : section === 'users' ? (
                      <Chip label={row.status} size="small" color={row.status === 'Active' ? 'success' : 'default'} variant="outlined" />
                    ) : (
                      <Chip label={row.status} size="small" color={row.status === 'Published' ? 'success' : 'default'} variant="outlined" />
                    )}
                  </TableCell>
                  {section === 'exams' && (
                    <TableCell align="right">
                      <Button
                        size="small"
                        onClick={() => dispatch(updateExaminationStatus({ id: row.id, status: row.isActive ? 'Draft' : 'Active' }))}
                      >
                        {row.isActive ? 'Deactivate' : 'Activate'}
                      </Button>
                    </TableCell>
                  )}
                  {section === 'users' && (
                    <TableCell align="right">
                      <Button
                        size="small"
                        onClick={() => dispatch(updateUserStatus({ id: row.id, status: row.status === 'Active' ? 'Suspended' : 'Active' }))}
                      >
                        {row.status === 'Active' ? 'Suspend' : 'Restore'}
                      </Button>
                    </TableCell>
                  )}
                  {section === 'courses' && <TableCell align="right">{row.students.toLocaleString()}</TableCell>}
                </TableRow>
              ))}
              {!rows.length && (
                <TableRow>
                  <TableCell colSpan={section === 'exams' || section === 'users' ? 4 : section === 'courses' ? 4 : 3} align="center" sx={{ py: 5 }}>
                    <Typography fontWeight={800}>No {title.toLowerCase()} found</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Box>
      )}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add examination</DialogTitle>
        <DialogContent sx={{ display: 'grid', gap: 2, pt: '16px !important' }}>
          <TextField label="Examination name" value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} />
          <TextField select label="Category" value={draft.category} onChange={(event) => setDraft({ ...draft, category: event.target.value })}>
            {['SSC Examinations', 'Odisha Government', 'Banking', 'Other Government'].map((category) => (
              <MenuItem key={category} value={category}>{category}</MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={saveExamination} disabled={!draft.name.trim()}>Add</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
