import { useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Box,
  Button,
  Card,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { Edit3, Plus, Trash2 } from 'lucide-react'
import { deleteNote, saveNote } from '../../store/slices/notesSlice'

const emptyNote = { title: '', subject: 'General', content: '' }

export default function NotesPage() {
  const dispatch = useDispatch()
  const notes = useSelector((state) => state.notes.items)
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState(emptyNote)
  const [subjectFilter, setSubjectFilter] = useState('All')

  const subjects = ['All', ...new Set(notes.map((note) => note.subject))]
  const filtered = useMemo(
    () => subjectFilter === 'All' ? notes : notes.filter((note) => note.subject === subjectFilter),
    [notes, subjectFilter],
  )

  const editNote = (note) => {
    setDraft(note)
    setOpen(true)
  }

  const save = () => {
    if (!draft.title.trim() || !draft.content.trim()) return
    dispatch(saveNote({
      ...draft,
      id: draft.id ?? `note-${Date.now()}`,
      updatedAt: new Date().toISOString(),
    }))
    setDraft(emptyNote)
    setOpen(false)
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1200, mx: 'auto' }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h4">Personal Notes</Typography>
          <Typography color="text.secondary" sx={{ mt: 0.5 }}>Organize revision notes by subject.</Typography>
        </Box>
        <Button variant="contained" startIcon={<Plus size={17} />} onClick={() => { setDraft(emptyNote); setOpen(true) }} sx={{ mt: { xs: 2, sm: 0 } }}>
          New note
        </Button>
      </Stack>
      <FormControl size="small" sx={{ mb: 2, minWidth: 180 }}>
        <InputLabel>Subject</InputLabel>
        <Select label="Subject" value={subjectFilter} onChange={(event) => setSubjectFilter(event.target.value)}>
          {subjects.map((subject) => <MenuItem key={subject} value={subject}>{subject === 'All' ? 'All subjects' : subject}</MenuItem>)}
        </Select>
      </FormControl>
      {filtered.length ? (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, gap: 2 }}>
          {filtered.map((note) => (
            <Card key={note.id} sx={{ p: 2.5, height: '100%' }}>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start" gap={1}>
                <Chip label={note.subject} size="small" variant="outlined" />
                <Stack direction="row">
                  <Button size="small" sx={{ minWidth: 36 }} onClick={() => editNote(note)} aria-label="Edit note"><Edit3 size={17} /></Button>
                  <Button size="small" sx={{ minWidth: 36 }} color="error" onClick={() => dispatch(deleteNote(note.id))} aria-label="Delete note"><Trash2 size={17} /></Button>
                </Stack>
              </Stack>
              <Typography variant="h6" sx={{ mt: 1.5 }}>{note.title}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1, whiteSpace: 'pre-wrap' }}>{note.content}</Typography>
            </Card>
          ))}
        </Box>
      ) : (
        <Box sx={{ p: 5, textAlign: 'center', bgcolor: 'white', border: '1px solid #e9edf4', borderRadius: 2.5 }}>
          <Typography fontWeight={800}>No notes found</Typography>
        </Box>
      )}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{draft.id ? 'Edit note' : 'Create note'}</DialogTitle>
        <DialogContent sx={{ display: 'grid', gap: 2, pt: '16px !important' }}>
          <TextField label="Title" value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} />
          <FormControl>
            <InputLabel>Subject</InputLabel>
            <Select label="Subject" value={draft.subject} onChange={(event) => setDraft({ ...draft, subject: event.target.value })}>
              {['General', 'Quantitative Aptitude', 'Reasoning', 'English', 'Indian Polity', 'Odisha GK', 'Current Affairs'].map((subject) => <MenuItem key={subject} value={subject}>{subject}</MenuItem>)}
            </Select>
          </FormControl>
          <TextField label="Note" multiline minRows={6} value={draft.content} onChange={(event) => setDraft({ ...draft, content: event.target.value })} />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={save} disabled={!draft.title.trim() || !draft.content.trim()}>Save note</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
