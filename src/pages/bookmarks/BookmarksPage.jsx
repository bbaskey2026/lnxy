import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Alert, Box, Button, Chip, CircularProgress, Stack, Typography } from '@mui/material'
import { BookmarkCheck } from 'lucide-react'
import { pruneBookmarks, toggleBookmark } from '../../store/slices/bookmarkSlice'
import { fetchCurrentAffairs } from '../../store/slices/currentAffairsSlice'
import { fetchStudyMaterials } from '../../store/slices/studyMaterialSlice'
import { useAppFeedback } from '../../hooks/useAppFeedback'

export default function BookmarksPage() {
  const dispatch = useDispatch()
  const { showSnackbar } = useAppFeedback()
  const { items } = useSelector((state) => state.bookmarks)
  const { bookmarkIds: materialBookmarks, items: studyMaterials, loading: materialsLoading, loaded: materialsLoaded, error: materialsError } = useSelector((state) => state.studyMaterials)
  const { items: currentAffairs, loading: affairsLoading, loaded: affairsLoaded, error: affairsError } = useSelector((state) => state.currentAffairs)
  const [filter, setFilter] = useState('All')

  useEffect(() => {
    dispatch(fetchStudyMaterials())
    dispatch(fetchCurrentAffairs())
  }, [dispatch])

  useEffect(() => {
    if (affairsLoaded) dispatch(pruneBookmarks({ type: 'current-affairs', validIds: currentAffairs.map((item) => item.id) }))
  }, [dispatch, currentAffairs, affairsLoaded])

  const currentAffairsIds = new Set(currentAffairs.map((item) => item.id))
  const unified = [
    ...items.filter((item) => item.type !== 'current-affairs' || !affairsLoaded || currentAffairsIds.has(item.id)),
    ...(materialsLoaded ? materialBookmarks.filter((id) => studyMaterials.some((item) => item.id === id)) : []).map((id) => ({
      id,
      type: 'study-material',
      title: studyMaterials.find((item) => item.id === id).title,
      subtitle: 'Study material',
    })),
  ]
  const filtered = filter === 'All' ? unified : unified.filter((item) => item.type === filter)
  const types = ['All', ...new Set(unified.map((item) => item.type))]

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h4">Bookmarks</Typography>
      <Typography color="text.secondary" sx={{ mt: 0.5, mb: 3 }}>Your saved lectures, resources and current affairs.</Typography>
      {(materialsError || affairsError) && <Alert severity="error" sx={{ mb: 2 }}>{materialsError ?? affairsError}</Alert>}
      {(materialsLoading || affairsLoading) && <CircularProgress sx={{ mb: 2 }} />}
      <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mb: 3 }}>
        {types.map((type) => (
          <Chip key={type} label={type === 'All' ? 'All' : type} clickable color={filter === type ? 'primary' : 'default'} variant={filter === type ? 'filled' : 'outlined'} onClick={() => setFilter(type)} />
        ))}
      </Stack>
      {(materialsLoading || affairsLoading || materialsError || affairsError) ? null : filtered.length ? (
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
                  onClick={() => {
                    if (item.type === 'study-material') return
                    dispatch(toggleBookmark(item))
                    showSnackbar(`"${item.title}" removed from bookmarks.`, {
                      actionLabel: 'Undo',
                      onAction: () => dispatch(toggleBookmark(item)),
                    })
                  }}
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
