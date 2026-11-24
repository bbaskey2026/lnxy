import { useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Button,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Tab,
  Tabs,
  Typography,
} from '@mui/material'
import { Clock3, FileCheck2, Users } from 'lucide-react'
import { startTest } from '../../store/slices/mockTestSlice'

export default function MockTestListPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const availableTests = useSelector((state) => state.mockTests.availableTests)
  const [category, setCategory] = useState('All')
  const [examination, setExamination] = useState('All')

  const categories = ['All', ...new Set(availableTests.map((test) => test.category))]
  const exams = ['All', ...new Set(availableTests.map((test) => test.examination))]
  const tests = useMemo(() => availableTests.filter((test) =>
    (category === 'All' || test.category === category)
    && (examination === 'All' || test.examination === examination),
  ), [availableTests, category, examination])

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1440, mx: 'auto' }}>
      <Typography variant="h4" sx={{ mb: 0.5 }}>Mock Tests</Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>Practice with timed examinations and instant results.</Typography>
      <Tabs value={category} onChange={(_, value) => setCategory(value)} sx={{ mb: 2 }}>
        {categories.map((item) => <Tab key={item} value={item} label={item} />)}
      </Tabs>
      <FormControl size="small" sx={{ mb: 3, minWidth: 220 }}>
        <InputLabel>Examination</InputLabel>
        <Select label="Examination" value={examination} onChange={(event) => setExamination(event.target.value)}>
          {exams.map((item) => <MenuItem key={item} value={item}>{item === 'All' ? 'All examinations' : item}</MenuItem>)}
        </Select>
      </FormControl>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, gap: 2 }}>
        {tests.map((test) => (
          <Box key={test.id} sx={{ p: 2.5, bgcolor: 'white', border: '1px solid #e9edf4', borderRadius: 2.5 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
              <Chip label={test.category} size="small" color="primary" variant="outlined" />
              <Chip label={test.examination} size="small" />
            </Stack>
            <Typography variant="h6" sx={{ mt: 2, minHeight: 48 }}>{test.title}</Typography>
            <Stack spacing={1} sx={{ mt: 2, mb: 2 }}>
              <Stack direction="row" spacing={1} alignItems="center"><Clock3 size={16} /><Typography variant="body2">{test.durationSeconds / 60} minutes</Typography></Stack>
              <Stack direction="row" spacing={1} alignItems="center"><FileCheck2 size={16} /><Typography variant="body2">{test.questions.length} questions • +{test.positiveMarks} / -{test.negativeMarks}</Typography></Stack>
              {test.attempted > 0 && <Stack direction="row" spacing={1} alignItems="center"><Users size={16} /><Typography variant="body2">{test.attempted.toLocaleString()} attempts</Typography></Stack>}
            </Stack>
            <Button
              fullWidth
              variant="contained"
              onClick={() => {
                dispatch(startTest(test.id))
                navigate(`/student/mock-tests/${test.id}`)
              }}
            >
              Start test
            </Button>
          </Box>
        ))}
      </Box>
    </Box>
  )
}
