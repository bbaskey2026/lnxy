import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Box, Button, Chip, Stack, Typography } from '@mui/material'
import { BookmarkCheck } from 'lucide-react'
import { toggleBookmark } from '../../store/slices/bookmarkSlice'

export default function BookmarksPage() {
  const dispatch = useDispatch()
  const { items } = useSelector((state) => state.bookmarks)
  const materialBookmarks = useSelector((state) => state.studyMaterials.bookmarkIds)
  const studyMaterials = useSelector((state) => state.studyMaterials.items)
  const [filter, setFilter] = useState('All')

  const unified = [
    ...items,
    ...materialBookmarks.map((id) => ({
      id,
      type: 'study-material',
      title: studyMaterials.find((item) => item.id === id)?.title ?? id,
      subtitle: 'Study material',
    })),
  ]
  const filtered = filter === 'All' ? unified : unified.filter((item) => item.type === filter)
  const types = ['All', ...new Set(unified.map((item) => item.type))]

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h4">Bookmarks</Typography>
      <Typography color="text.secondary" sx={{ mt: 0.5, mb: 3 }}>Your saved lectures, resources and current affairs.</Typography>
      <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mb: 3 }}>
        {types.map((type) => (
          <Chip key={type} label={type === 'All' ? 'All' : type} clickable color={filter === type ? 'primary' : 'default'} variant={filter === type ? 'filled' : 'outlined'} onClick={() => setFilter(type)} />
        ))}
      </Stack>
      {filtered.length ? (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 2 }}>
          {filtered.map((item) => (
            <Box key={`${item.type}-${item.id}`} sx={{ p: 2.5, bgcolor: 'white', border: '1px solid #e9edf4', borderRadius: 2.5 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start" gap={2}>
                <Box>
                  <Chip label={item.type} size="small" variant="outlined" />
                  <Typography variant="h6" sx={{ mt: 1 }}>{item.title}</Typography>
                  {item.subtitle && <Typography variant="body2" color="text.secondary">{item.subtitle}</Typography>}
                </Box>
                <Button
                  sx={{ minWidth: 36 }}
                  onClick={() => item.type === 'study-material'
                    ? null
                    : dispatch(toggleBookmark(item))}
                  aria-label="Remove bookmark"
                >
                  <BookmarkCheck size={20} />
                </Button>
              </Stack>
            </Box>
          ))}
        </Box>
      ) : (
        <Box sx={{ p: 5, textAlign: 'center', bgcolor: 'white', border: '1px solid #e9edf4', borderRadius: 2.5 }}>
          <Typography fontWeight={800}>No bookmarks yet</Typography>
        </Box>
      )}
    </Box>
  )
}
