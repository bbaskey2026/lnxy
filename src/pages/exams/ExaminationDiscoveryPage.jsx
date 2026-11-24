import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { ArrowRight, Search } from 'lucide-react'
import { examService } from '../../services/examService'

export default function ExaminationDiscoveryPage() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [examinations, setExaminations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    examService.list()
      .then(setExaminations)
      .catch((requestError) => setError(requestError.response?.data?.error?.message ?? 'Unable to load examinations.'))
      .finally(() => setLoading(false))
  }, [])
  const categories = ['All', ...new Set(examinations.map((exam) => exam.category))]
  const results = useMemo(() => examinations.filter((exam) => {
    const matchesCategory = category === 'All' || exam.category === category
    const matchesQuery = `${exam.name} ${exam.description}`.toLowerCase().includes(query.toLowerCase())
    return matchesCategory && matchesQuery
  }), [examinations, category, query])

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
      <Typography variant="h4" sx={{ mb: 1 }}>Discover Examinations</Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Choose an examination to explore its syllabus, pattern, papers and preparation courses.
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {loading && <CircularProgress sx={{ mb: 2 }} />}
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 3 }}>
        <TextField
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search examinations"
          size="small"
          sx={{ maxWidth: { md: 420 }, bgcolor: 'white' }}
          slotProps={{
            input: {
              startAdornment: <InputAdornment position="start"><Search size={18} /></InputAdornment>,
            },
          }}
        />
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {categories.map((item) => (
            <Chip
              key={item}
              label={item}
              clickable
              color={category === item ? 'primary' : 'default'}
              variant={category === item ? 'filled' : 'outlined'}
              onClick={() => setCategory(item)}
            />
          ))}
        </Box>
      </Stack>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, gap: 2 }}>
        {results.map((exam) => (
          <Card key={exam.id} sx={{ height: '100%' }}>
            <CardContent sx={{ p: 2.5, height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                <Box sx={{ width: 52, height: 52, borderRadius: 2, bgcolor: 'primary.light', color: 'primary.main', display: 'grid', placeItems: 'center', fontWeight: 900 }}>
                  {exam.shortName ?? exam.name.split(' ').map((part) => part[0]).join('').slice(0, 4).toUpperCase()}
                </Box>
                <Chip label={exam.category} size="small" variant="outlined" />
              </Stack>
              <Typography variant="h6" sx={{ mt: 2 }}>{exam.name}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75, mb: 2, flexGrow: 1 }}>
                {exam.description}
              </Typography>
              <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                <Chip label={`${exam.mockTests ?? 0} tests`} size="small" />
                <Chip label={`${exam.papers ?? 0} papers`} size="small" />
              </Stack>
              <Button
                variant="outlined"
                endIcon={<ArrowRight size={16} />}
                onClick={() => navigate(`/exams/${exam.id}`)}
              >
                View details
              </Button>
            </CardContent>
          </Card>
        ))}
      </Box>
      {!results.length && (
        <Card sx={{ p: 4, textAlign: 'center' }}>
          <Typography fontWeight={800}>No examinations found</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Try another search or category.
          </Typography>
        </Card>
      )}
    </Container>
  )
}
