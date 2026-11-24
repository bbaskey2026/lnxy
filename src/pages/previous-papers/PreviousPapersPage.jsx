import { useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  Alert,
  Box,
  Button,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from '@mui/material'
import { Download, FileCheck2, PlayCircle } from 'lucide-react'
import { markPaperDownloaded } from '../../store/slices/previousPaperSlice'

export default function PreviousPapersPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { items, downloadedIds } = useSelector((state) => state.previousPapers)
  const [examination, setExamination] = useState('All')
  const [year, setYear] = useState('All')
  const [subject, setSubject] = useState('All')
  const [message, setMessage] = useState('')

  const filtered = useMemo(() => items.filter((paper) =>
    (examination === 'All' || paper.examination === examination)
    && (year === 'All' || paper.year === Number(year))
    && (subject === 'All' || paper.subject === subject),
  ), [items, examination, year, subject])

  const downloadPaper = (paper) => {
    const content = [
      paper.title,
      `${paper.examination} • ${paper.year}`,
      `Subject: ${paper.subject}`,
      `Questions: ${paper.questions}`,
      '',
      'Download package placeholder: Connect this button to a configured PDF or answer-key URL.',
    ].join('\n')
    const url = URL.createObjectURL(new Blob([content], { type: 'text/plain;charset=utf-8' }))
    const link = document.createElement('a')
    link.href = url
    link.download = `${paper.title.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}-preview.txt`
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
    dispatch(markPaperDownloaded(paper.id))
    setMessage(`${paper.title} downloaded.`)
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1440, mx: 'auto' }}>
      <Typography variant="h4">Previous Year Papers</Typography>
      <Typography color="text.secondary" sx={{ mt: 0.5, mb: 3 }}>Filter by examination, year and subject.</Typography>
      {message && <Alert severity="success" onClose={() => setMessage('')} sx={{ mb: 2 }}>{message}</Alert>}
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} sx={{ mb: 3 }}>
        {[
          ['Examination', examination, ['All', ...new Set(items.map((item) => item.examination))], setExamination],
          ['Year', year, ['All', ...new Set(items.map((item) => String(item.year)))], setYear],
          ['Subject', subject, ['All', ...new Set(items.map((item) => item.subject))], setSubject],
        ].map(([label, value, values, setter]) => (
          <FormControl key={label} size="small" sx={{ minWidth: 180 }}>
            <InputLabel>{label}</InputLabel>
            <Select label={label} value={value} onChange={(event) => setter(event.target.value)}>
              {values.map((item) => <MenuItem key={item} value={item}>{item === 'All' ? `All ${label.toLower}s` : item}</MenuItem>)}
            </Select>
          </FormControl>
        ))}
      </Stack>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{filtered.length} papers found</Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, gap: 2 }}>
        {filtered.map((paper) => (
          <Box key={paper.id} sx={{ p: 2.5, bgcolor: 'white', border: '1px solid #e9edf4', borderRadius: 2.5 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
              <Chip label={paper.year} color="primary" variant="outlined" />
              {downloadedIds.includes(paper.id) && <Chip label="Downloaded" size="small" color="success" />}
            </Stack>
            <Typography variant="h6" sx={{ mt: 2 }}>{paper.title}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>{paper.subject} • {paper.questions} questions • {paper.size}</Typography>
            <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
              <Button variant="outlined" startIcon={<FileCheck2 size={16} />} onClick={() => downloadPaper(paper)}>Answer key</Button>
              <Button variant="contained" startIcon={<Download size={16} />} onClick={() => downloadPaper(paper)}>Download</Button>
            </Stack>
            <Button
              fullWidth
              variant="text"
              startIcon={<PlayCircle size={16} />}
              sx={{ mt: 1 }}
              onClick={() => navigate('/student/mock-tests')}
            >
              Attempt as mock
            </Button>
          </Box>
        ))}
      </Box>
      {!filtered.length && (
        <Box sx={{ p: 5, textAlign: 'center', bgcolor: 'white', border: '1px solid #e9edf4', borderRadius: 2.5 }}>
          <Typography fontWeight={800}>No previous year papers found</Typography>
        </Box>
      )}
    </Box>
  )
}
