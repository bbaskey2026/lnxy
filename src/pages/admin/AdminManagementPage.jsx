import { useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Box,
  Button,
  Chip,
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
import { addExamination, updateExaminationStatus, updateUserStatus } from '../../store/slices/adminSlice'

export default function AdminManagementPage({ section }) {
  const dispatch = useDispatch()
  const admin = useSelector((state) => state.admin)
  const [query, setQuery] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [draft, setDraft] = useState({ name: '', category: 'SSC Examinations' })

  const title = {
    exams: 'Examinations',
    courses: 'Courses',
    materials: 'Study materials',
    users: 'Users',
    reports: 'Reports',
  }[section] ?? 'Management'

  const rows = useMemo(() => {
    const source = section === 'exams'
      ? admin.examinations
      : section === 'courses'
        ? admin.courses
        : section === 'users'
          ? admin.users
          : section === 'materials'
            ? [
                { id: 'm1', name: 'Quantitative Formula Book', category: 'Formula Sheet', status: 'Published' },
                { id: 'm2', name: 'Odisha GK 2026', category: 'Handwritten Notes', status: 'Published' },
                { id: 'm3', name: 'Monthly Current Affairs', category: 'PDF', status: 'Draft' },
              ]
            : [
                { id: 'r1', name: 'Student growth report', category: 'Platform', status: 'Available' },
                { id: 'r2', name: 'Test performance report', category: 'Academics', status: 'Available' },
              ]
    return source.filter((row) => `${row.name ?? row.title ?? ''} ${row.category ?? row.email ?? ''}`.toLowerCase().includes(query.toLowerCase()))
  }, [section, admin, query])

  const saveExamination = () => {
    if (!draft.name.trim()) return
    dispatch(addExamination(draft))
    setDraft({ name: '', category: 'SSC Examinations' })
    setDialogOpen(false)
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1440, mx: 'auto' }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h4">{title}</Typography>
          <Typography color="text.secondary" sx={{ mt: 0.5 }}>Manage platform content and accounts.</Typography>
        </Box>
        {section === 'exams' && (
          <Button variant="contained" startIcon={<Plus size={17} />} onClick={() => setDialogOpen(true)} sx={{ mt: { xs: 2, sm: 0 } }}>Add examination</Button>
        )}
      </Stack>
      <TextField size="small" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`Search ${title.toLowerCase()}`} sx={{ mb: 2, width: { xs: '100%', sm: 320 }, bgcolor: 'white' }} />
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
                    <Typography variant="body2" color="text.secondary">{row.category ?? row.instructor ?? 'Platform data'}</Typography>
                  )}
                </TableCell>
                <TableCell>
                  {section === 'exams' ? (
                    <TextField
                      select
                      size="small"
                      value={row.status}
                      onChange={(event) => dispatch(updateExaminationStatus({ id: row.id, status: event.target.value }))}
                      sx={{ minWidth: 110 }}
                    >
                      <MenuItem value="Active">Active</MenuItem>
                      <MenuItem value="Draft">Draft</MenuItem>
                      <MenuItem value="Archived">Archived</MenuItem>
                    </TextField>
                  ) : section === 'users' ? (
                    <TextField
                      select
                      size="small"
                      value={row.status}
                      onChange={(event) => dispatch(updateUserStatus({ id: row.id, status: event.target.value }))}
                      sx={{ minWidth: 110 }}
                    >
                      <MenuItem value="Active">Active</MenuItem>
                      <MenuItem value="Suspended">Suspended</MenuItem>
                    </TextField>
                  ) : (
                    <Chip label={row.status} size="small" color={row.status === 'Active' || row.status === 'Published' || row.status === 'Available' ? 'success' : 'default'} variant="outlined" />
                  )}
                </TableCell>
                {section === 'exams' && (
                  <TableCell align="right"><Button size="small" onClick={() => dispatch(updateExaminationStatus({ id: row.id, status: row.status === 'Active' ? 'Draft' : 'Active' }))}>{row.status === 'Active' ? 'Deactivate' : 'Activate'}</Button></TableCell>
                )}
                {section === 'users' && <TableCell align="right"><Button size="small" onClick={() => dispatch(updateUserStatus({ id: row.id, status: row.status === 'Active' ? 'Suspended' : 'Active' }))}>{row.status === 'Active' ? 'Suspend' : 'Restore'}</Button></TableCell>}
                {section === 'courses' && <TableCell align="right">{row.students?.toLocaleString()}</TableCell>}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add examination</DialogTitle>
        <DialogContent sx={{ display: 'grid', gap: 2, pt: '16px !important' }}>
          <TextField label="Examination name" value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} />
          <TextField select label="Category" value={draft.category} onChange={(event) => setDraft({ ...draft, category: event.target.value })}>
            {['SSC Examinations', 'Odisha Government', 'Banking', 'Other Government'].map((category) => <MenuItem key={category} value={category}>{category}</MenuItem>)}
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
