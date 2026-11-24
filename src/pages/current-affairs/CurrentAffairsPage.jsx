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
  InputAdornment,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material'
import { Bookmark, BookmarkCheck, Search } from 'lucide-react'
import { setSelectedPeriod } from '../../store/slices/currentAffairsSlice'
import { toggleBookmark } from '../../store/slices/bookmarkSlice'

export default function CurrentAffairsPage() {
  const dispatch = useDispatch()
  const { items, selectedPeriod } = useSelector((state) => state.currentAffairs)
  const bookmarkItems = useSelector((state) => state.bookmarks.items)
  const [category, setCategory] = useState('All')
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(null)

  const categories = ['All', ...new Set(items.map((item) => item.category))]
  const filtered = useMemo(() => items.filter((item) =>
    (category === 'All' || item.category === category)
    && `${item.title} ${item.summary}`.toLowerCase().includes(query.toLowerCase()),
  ), [items, category, query])

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1440, mx: 'auto' }}>
      <Typography variant="h4">Current Affairs</Typography>
      <Typography color="text.secondary" sx={{ mt: 0.5, mb: 2 }}>Track daily updates and exam-relevant news.</Typography>
      <Tabs value={selectedPeriod} onChange={(_, value) => dispatch(setSelectedPeriod(value))} sx={{ mb: 2 }}>
        <Tab value="daily" label="Daily" />
        <Tab value="monthly" label="Monthly" />
        <Tab value="quiz" label="Quiz" />
      </Tabs>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} sx={{ mb: 2 }}>
        <TextField
          size="small"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search current affairs"
          sx={{ maxWidth: 420 }}
          slotProps={{ input: { startAdornment: <InputAdornment position="start"><Search size={18} /></InputAdornment> } }}
        />
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {categories.map((item) => (
            <Chip key={item} label={item} clickable color={category === item ? 'primary' : 'default'} variant={category === item ? 'filled' : 'outlined'} onClick={() => setCategory(item)} />
          ))}
        </Box>
      </Stack>
      {selectedPeriod === 'quiz' ? (
        <Box sx={{ p: 5, textAlign: 'center', bgcolor: 'white', border: '1px solid #e9edf4', borderRadius: 2.5 }}>
          <Typography variant="h6">Current Affairs Quiz</Typography>
          <Typography color="text.secondary" sx={{ mt: 1, mb: 2 }}>A 10-question daily quiz will be available with the next content update.</Typography>
          <Button variant="contained" onClick={() => dispatch(setSelectedPeriod('daily'))}>Return to updates</Button>
        </Box>
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, gap: 2 }}>
          {filtered.map((item) => {
            const bookmarked = bookmarkItems.some((entry) => entry.id === item.id && entry.type === 'current-affairs')
            return (
              <Box key={item.id} sx={{ p: 2.5, bgcolor: 'white', border: '1px solid #e9edf4', borderRadius: 2.5, height: '100%' }}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                  <Chip label={item.category} size="small" variant="outlined" />
                  <Button
                    size="small"
                    sx={{ minWidth: 36, p: 0.5 }}
                    onClick={() => dispatch(toggleBookmark({ id: item.id, type: 'current-affairs', title: item.title, subtitle: item.category }))}
                    aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark'}
                  >
                    {bookmarked ? <BookmarkCheck size={19} /> : <Bookmark size={19} />}
                  </Button>
                </Stack>
                <Typography variant="h6" sx={{ mt: 1.5 }}>{item.title}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>{item.summary}</Typography>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 2 }}>
                  <Typography variant="caption" color="text.secondary">{item.date}</Typography>
                  <Chip label={item.importance} size="small" color={item.importance === 'High' ? 'error' : 'default'} variant="outlined" />
                </Stack>
                <Button size="small" sx={{ mt: 1.5, p: 0 }} onClick={() => setSelected(item)}>Read details</Button>
              </Box>
            )
          })}
        </Box>
      )}
      <Dialog open={Boolean(selected)} onClose={() => setSelected(null)} maxWidth="sm" fullWidth>
        {selected && (
          <>
            <DialogTitle>{selected.title}</DialogTitle>
            <DialogContent>
              <Chip label={selected.category} size="small" sx={{ mb: 2 }} />
              <Typography>{selected.summary}</Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>{selected.date}</Typography>
            </DialogContent>
            <DialogActions><Button onClick={() => setSelected(null)}>Close</Button></DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  )
}
