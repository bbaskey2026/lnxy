import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  Alert,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material'
import { Bookmark, BookmarkCheck, Search } from 'lucide-react'
import ContentPreviewImage from '../../components/preview/ContentPreviewImage'
import { fetchCurrentAffairs, setSelectedPeriod } from '../../store/slices/currentAffairsSlice'
import { pruneBookmarks, toggleBookmark } from '../../store/slices/bookmarkSlice'

export default function CurrentAffairsPage() {
  const dispatch = useDispatch()
  const { items, selectedPeriod, loading, loaded, error } = useSelector((state) => state.currentAffairs)
  const bookmarkItems = useSelector((state) => state.bookmarks.items)
  const [category, setCategory] = useState('All')
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    dispatch(fetchCurrentAffairs())
  }, [dispatch])

  useEffect(() => {
    if (loaded) dispatch(pruneBookmarks({ type: 'current-affairs', validIds: items.map((item) => item.id) }))
  }, [dispatch, items, loaded])

  const categories = ['All', ...new Set(items.map((item) => item.category).filter(Boolean))]
  const filtered = useMemo(() => items.filter((item) =>
    (!item.period || item.period === selectedPeriod)
    && (category === 'All' || item.category === category)
    && `${item.title} ${item.summary}`.toLowerCase().includes(query.toLowerCase()),
  ), [items, selectedPeriod, category, query])

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1440, mx: 'auto' }}>
      <Typography variant="h4">Current Affairs</Typography>
      <Typography color="text.secondary" sx={{ mt: 0.5, mb: 2 }}>Track daily updates and exam-relevant news.</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
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
          <Typography color="text.secondary" sx={{ mt: 1, mb: 2 }}>Quiz questions are not available from the backend yet.</Typography>
          <Button variant="contained" onClick={() => dispatch(setSelectedPeriod('daily'))}>Return to updates</Button>
        </Box>
      ) : (
        loading ? (
          <Box sx={{ py: 8, display: 'grid', placeItems: 'center' }}><CircularProgress /></Box>
        ) : error ? null : filtered.length ? (
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, gap: 2 }}>
          {filtered.map((item) => {
            const bookmarked = bookmarkItems.some((entry) => entry.id === item.id && entry.type === 'current-affairs')
            return (
              <Box key={item.id} sx={{ bgcolor: 'white', border: '1px solid #e3e7ef', height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <ContentPreviewImage
                  title={item.title}
                  category={item.category}
                  imageUrl={item.thumbnailUrl ?? item.previewImage ?? item.imageUrl}
                  kind="article"
                  height={168}
                />
                <Box sx={{ p: 2.25, display: 'flex', flexDirection: 'column', flex: 1 }}>
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
                  <Typography variant="h6" sx={{ mt: 1.25, fontSize: 15, lineHeight: 1.4 }}>{item.title}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75, flex: 1 }}>{item.summary}</Typography>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 1.75, pt: 1.25, borderTop: '1px solid #edf0f5' }}>
                    <Typography variant="caption" color="text.secondary">{item.date}</Typography>
                    <Chip label={item.importance} size="small" color={item.importance === 'High' ? 'error' : 'default'} variant="outlined" />
                  </Stack>
                  <Button size="small" sx={{ mt: 1.25, p: 0, alignSelf: 'flex-start' }} onClick={() => setSelected(item)}>Read details</Button>
                </Box>
              </Box>
            )
          })}
          </Box>
        ) : (
          <Box sx={{ p: 5, textAlign: 'center', bgcolor: 'white', border: '1px solid #e3e7ef' }}>
            <Typography fontWeight={800}>No current affairs available</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>New updates will appear here when published.</Typography>
          </Box>
        )
      )}
      <Dialog open={Boolean(selected)} onClose={() => setSelected(null)} maxWidth="sm" fullWidth>
        {selected && (
          <>
            <DialogTitle>{selected.title}</DialogTitle>
            <DialogContent>
              <ContentPreviewImage
                title={selected.title}
                category={selected.category}
                imageUrl={selected.thumbnailUrl ?? selected.previewImage ?? selected.imageUrl}
                kind="article"
                height={210}
              />
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
