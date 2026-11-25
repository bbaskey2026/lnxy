import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Alert,
  Select,
  Stack,
  Typography,
} from '@mui/material'
import { Download, FileCheck2 } from 'lucide-react'
import { fetchPreviousPapers } from '../../store/slices/previousPaperSlice'
import { useAppFeedback } from '../../hooks/useAppFeedback'

export default function PreviousPapersPage() {
  const dispatch = useDispatch()
  const { showToast } = useAppFeedback()
  const { items, loading, error } = useSelector((state) => state.previousPapers)
  const [examination, setExamination] = useState('All')
  const [year, setYear] = useState('All')
  const [subject, setSubject] = useState('All')

  useEffect(() => {
    dispatch(fetchPreviousPapers())
  }, [dispatch])

  const filtered = useMemo(() => items.filter((paper) =>
    (examination === 'All' || paper.examination === examination)
    && (year === 'All' || paper.year === Number(year))
    && (subject === 'All' || paper.subject === subject),
  ), [items, examination, year, subject])
  const examinations = [...new Set(items.map((item) => item.examination).filter(Boolean))]
  const years = [...new Set(items.map((item) => item.year).filter(Number.isFinite).map(String))]
  const subjects = [...new Set(items.map((item) => item.subject).filter(Boolean))]

  const downloadPaper = (paper) => {
    const url = paper.fileUrl
    if (!url) return
    const link = document.createElement('a')
    link.href = url
    link.target = '_blank'
    link.rel = 'noreferrer'
    document.body.appendChild(link)
    link.click()
    link.remove()
    showToast(`${paper.title} downloaded.`)
  }

  const downloadAnswerKey = (paper) => {
    if (!paper.answerKeyUrl) return
    const link = document.createElement('a')
    link.href = paper.answerKeyUrl
    link.target = '_blank'
    link.rel = 'noreferrer'
    document.body.appendChild(link)
    link.click()
    link.remove()
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1440, mx: 'auto' }}>
      <Typography variant="h4">Previous Year Papers</Typography>
      <Typography color="text.secondary" sx={{ mt: 0.5, mb: 3 }}>Filter by examination, year and subject.</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} sx={{ mb: 3 }}>
        {[
          ['Examination', examination, ['All', ...examinations], setExamination],
          ['Year', year, ['All', ...years], setYear],
          ['Subject', subject, ['All', ...subjects], setSubject],
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
      {loading ? (
        <Box sx={{ py: 8, display: 'grid', placeItems: 'center' }}><CircularProgress /></Box>
      ) : (
        error ? null : filtered.length ? (
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, gap: 2 }}>
            {filtered.map((paper) => (
              <Box key={paper.id} sx={{ p: 2.5, bgcolor: 'white', border: '1px solid #e9edf4', borderRadius: 2.5 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                  <Chip label={paper.year ?? 'Year unavailable'} color="primary" variant="outlined" />
                </Stack>
                <Typography variant="h6" sx={{ mt: 2 }}>{paper.title}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
                  {[paper.subject, paper.questions ? `${paper.questions} questions` : null, paper.size].filter(Boolean).join(' • ')}
                </Typography>
                <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                  <Button variant="outlined" startIcon={<FileCheck2 size={16} />} onClick={() => downloadAnswerKey(paper)} disabled={!paper.answerKeyUrl}>Answer key</Button>
                  <Button variant="contained" startIcon={<Download size={16} />} onClick={() => downloadPaper(paper)} disabled={!paper.fileUrl}>Download</Button>
                </Stack>
              </Box>
            ))}
          </Box>
        ) : (
          <Box sx={{ p: 5, textAlign: 'center', bgcolor: 'white', border: '1px solid #e9edf4', borderRadius: 2.5 }}>
            <Typography fontWeight={800}>No previous year papers found</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>Papers will appear here when they are published.</Typography>
          </Box>
        )
      )}
    </Box>
  )
}
