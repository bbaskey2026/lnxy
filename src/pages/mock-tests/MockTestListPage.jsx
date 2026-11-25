import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  Alert,
  Box,
  Button,
  FormControl,
  InputAdornment,
  MenuItem,
  Select,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import {
  ArrowUpRight,
  BookOpenCheck,
  Clock3,
  FileCheck2,
  Search,
  Target,
  X,
} from 'lucide-react'
import { MockTestCard, MockTestStat } from '../../components/mock-tests/MockTestUI'
import { fetchMockTests, startTest } from '../../store/slices/mockTestSlice'

const fieldSx = {
  '& .MuiOutlinedInput-root': { borderRadius: 0, bgcolor: 'white' },
  '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e3e7ef' },
}

export default function MockTestListPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { availableTests, loading, error } = useSelector((state) => state.mockTests)
  const [category, setCategory] = useState('All')
  const [examination, setExamination] = useState('All')
  const [search, setSearch] = useState('')

  useEffect(() => {
    dispatch(fetchMockTests())
  }, [dispatch])

  const categories = useMemo(() => ['All', ...new Set(availableTests.map((test) => test.category).filter(Boolean))], [availableTests])
  const exams = useMemo(() => ['All', ...new Set(availableTests.map((test) => test.examination).filter(Boolean))], [availableTests])
  const tests = useMemo(() => {
    const query = search.trim().toLowerCase()
    return availableTests.filter((test) => (
      (category === 'All' || test.category === category)
      && (examination === 'All' || test.examination === examination)
      && (!query || `${test.title} ${test.examination} ${test.category}`.toLowerCase().includes(query))
    ))
  }, [availableTests, category, examination, search])

  const questionCount = availableTests.reduce(
    (total, test) => total + (test.questionCount ?? test.questions?.length ?? test.questionIds?.length ?? 0),
    0,
  )

  const clearFilters = () => {
    setCategory('All')
    setExamination('All')
    setSearch('')
  }

  return (
    <Box sx={{ minHeight: 'calc(100vh - 72px)', pb: 5, bgcolor: '#f5f7fb' }}>
      <Box sx={{ px: { xs: 2, sm: 3, lg: 4 }, pt: { xs: 2.5, md: 4 }, maxWidth: 1440, mx: 'auto' }}>
        

        {error && (
          <Alert
            severity="error"
            action={(
              <Button color="inherit" size="small" onClick={() => dispatch(fetchMockTests())} sx={{ borderRadius: 0 }}>
                Try again
              </Button>
            )}
            sx={{ mb: 2, borderRadius: 0 }}
          >
            {error}
          </Alert>
        )}

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'minmax(240px, 1fr) 220px 220px auto' },
            gap: 1.25,
            alignItems: 'center',
            p: 1.5,
            mb: 2,
            bgcolor: 'white',
            border: '1px solid #e3e7ef',
          }}
        >
          <TextField
            size="small"
            placeholder="Search tests or exams"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            inputProps={{ 'aria-label': 'Search mock tests' }}
            sx={fieldSx}
            InputProps={{
              startAdornment: <InputAdornment position="start"><Search size={17} color="#667085" /></InputAdornment>,
              endAdornment: search && (
                <InputAdornment position="end">
                  <Button aria-label="Clear search" onClick={() => setSearch('')} sx={{ minWidth: 32, p: 0.5, color: '#667085' }}>
                    <X size={15} />
                  </Button>
                </InputAdornment>
              ),
            }}
          />
          <FormControl size="small" sx={fieldSx}>
            <Select
              aria-label="Filter by category"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              displayEmpty
            >
              {categories.map((item) => <MenuItem key={item} value={item}>{item === 'All' ? 'All categories' : item}</MenuItem>)}
            </Select>
          </FormControl>
          <FormControl size="small" sx={fieldSx}>
            <Select
              aria-label="Filter by examination"
              value={examination}
              onChange={(event) => setExamination(event.target.value)}
              displayEmpty
            >
              {exams.map((item) => <MenuItem key={item} value={item}>{item === 'All' ? 'All examinations' : item}</MenuItem>)}
            </Select>
          </FormControl>
          <Button
            variant="text"
            onClick={clearFilters}
            disabled={category === 'All' && examination === 'All' && !search}
            sx={{ borderRadius: 0, minHeight: 40, color: '#667085', whiteSpace: 'nowrap' }}
          >
            Clear filters
          </Button>
        </Box>

        <Stack id="mock-test-list" direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5, scrollMarginTop: 96 }}>
          <Typography sx={{ fontSize: 15, fontWeight: 800, color: '#232323' }}>
            Available tests
          </Typography>
          {!loading && (
            <Typography variant="caption" color="text.secondary">
              Showing {tests.length} of {availableTests.length}
            </Typography>
          )}
        </Stack>

        {loading && !availableTests.length ? (
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', xl: 'repeat(3, 1fr)' }, gap: 2 }}>
            {[0, 1, 2].map((item) => (
              <Box key={item} sx={{ p: 2.5, minHeight: 275, bgcolor: 'white', border: '1px solid #e3e7ef' }}>
                <Skeleton variant="rectangular" width={94} height={22} />
                <Skeleton width="72%" height={32} sx={{ mt: 2 }} />
                <Skeleton width="48%" />
                <Skeleton width="60%" />
                <Skeleton variant="rectangular" height={42} sx={{ mt: 4 }} />
              </Box>
            ))}
          </Box>
        ) : tests.length ? (
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', xl: 'repeat(3, 1fr)' }, gap: 2 }}>
            {tests.map((test) => (
              <MockTestCard
                key={test.id}
                test={test}
                onStart={() => {
                  dispatch(startTest(test.id))
                  navigate(`/student/mock-tests/${test.id}`)
                }}
              />
            ))}
          </Box>
        ) : (
          <Box sx={{ py: 7, px: 2, textAlign: 'center', bgcolor: 'white', border: '1px solid #e3e7ef' }}>
            <Box sx={{ width: 44, height: 44, mx: 'auto', mb: 1.5, display: 'grid', placeItems: 'center', bgcolor: '#edf4ff', color: '#0847c6' }}>
              <Clock3 size={21} />
            </Box>
            <Typography sx={{ fontSize: 15, fontWeight: 800 }}>
              {availableTests.length ? 'No tests match these filters' : 'No mock tests available yet'}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
              {availableTests.length ? 'Try another search or clear your filters.' : 'Check back soon for new practice tests.'}
            </Typography>
            {availableTests.length > 0 && (
              <Button onClick={clearFilters} sx={{ mt: 1.5, borderRadius: 0, color: '#c2410c' }}>
                Clear filters
              </Button>
            )}
          </Box>
        )}
      </Box>
    </Box>
  )
}
