import {
  Avatar,
  Box,
  Button,
  Chip,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material'
import { Bookmark, BookmarkCheck, Download, Eye, FileText } from 'lucide-react'

export default function ResourceCard({
  resource,
  bookmarked,
  downloaded,
  onBookmark,
  onPreview,
  onDownload,
}) {
  return (
    <Box sx={{ p: 2.25, height: '100%', border: '1px solid #e9edf4', borderRadius: 2.5, bgcolor: 'white', display: 'flex', flexDirection: 'column' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
        <Avatar variant="rounded" sx={{ width: 50, height: 50, bgcolor: '#eef1ff', color: 'primary.main' }}>
          <FileText size={22} />
        </Avatar>
        <Tooltip title={bookmarked ? 'Remove bookmark' : 'Bookmark resource'}>
          <IconButton
            aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark resource'}
            onClick={() => onBookmark(resource.id)}
            color={bookmarked ? 'primary' : 'default'}
          >
            {bookmarked ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
          </IconButton>
        </Tooltip>
      </Stack>
      <Typography variant="h6" sx={{ mt: 1.5, fontSize: 17, lineHeight: 1.35 }}>{resource.title}</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75, flexGrow: 1 }}>
        {resource.description}
      </Typography>
      <Stack direction="row" spacing={0.75} flexWrap="wrap" sx={{ my: 1.5 }}>
        <Chip label={resource.category} size="small" variant="outlined" />
        <Chip label={resource.format} size="small" color={downloaded ? 'success' : 'default'} variant={downloaded ? 'filled' : 'outlined'} />
      </Stack>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
        <Typography variant="caption" color="text.secondary">{resource.examination} • {resource.size}</Typography>
        <Typography variant="caption" fontWeight={800}>{resource.popularity}% popular</Typography>
      </Stack>
      <Stack direction="row" spacing={1}>
        <Button variant="outlined" startIcon={<Eye size={16} />} sx={{ flex: 1 }} onClick={() => onPreview(resource)}>
          Preview
        </Button>
        <Button variant="contained" startIcon={<Download size={16} />} sx={{ flex: 1 }} onClick={() => onDownload(resource)}>
          {downloaded ? 'Download again' : 'Download'}
        </Button>
      </Stack>
    </Box>
  )
}
