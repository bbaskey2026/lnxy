import {
  Box,
  Button,
  Chip,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material'
import { Bookmark, BookmarkCheck, Download, Eye } from 'lucide-react'
import ContentPreviewImage from '../preview/ContentPreviewImage'
import ExamLogo from '../ExamLogo'

export default function ResourceCard({
  resource,
  bookmarked,
  onBookmark,
  onPreview,
  onDownload,
}) {
  return (
    <Box sx={{ height: '100%', border: '1px solid #e3e7ef', bgcolor: 'white', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <ContentPreviewImage
        title={resource.title}
        category={resource.category}
        imageUrl={resource.thumbnailUrl ?? resource.previewImage ?? resource.imageUrl}
        kind="resource"
        height={168}
      />
      <Box sx={{ p: 2.25, display: 'flex', flexDirection: 'column', flex: 1 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <Chip label={resource.category} size="small" variant="outlined" />
          <Tooltip title={bookmarked ? 'Remove bookmark' : 'Bookmark resource'}>
            <IconButton
              aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark resource'}
              onClick={() => onBookmark(resource.id)}
              color={bookmarked ? 'primary' : 'default'}
              size="small"
            >
              {bookmarked ? <BookmarkCheck size={19} /> : <Bookmark size={19} />}
            </IconButton>
          </Tooltip>
        </Stack>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
          <ExamLogo name={resource.examination ?? resource.title} size={28} />
          <Typography variant="h6" sx={{ fontSize: 15, lineHeight: 1.4 }}>{resource.title}</Typography>
        </Stack>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75, flexGrow: 1 }}>
          {resource.description}
        </Typography>
        <Stack direction="row" spacing={0.75} flexWrap="wrap" sx={{ my: 1.5 }}>
          <Chip label={resource.format} size="small" variant="outlined" />
          <Chip label={`${resource.pages} pages`} size="small" variant="outlined" />
        </Stack>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
          <Typography variant="caption" color="text.secondary">{resource.size}</Typography>
          <Typography variant="caption" fontWeight={800}>{resource.popularity}% popular</Typography>
        </Stack>
        <Stack direction="row" spacing={1}>
          <Button variant="outlined" startIcon={<Eye size={16} />} sx={{ flex: 1 }} onClick={() => onPreview(resource)}>
            Preview
          </Button>
          <Button
            variant="contained"
            startIcon={<Download size={16} />}
            sx={{ flex: 1 }}
            onClick={() => onDownload(resource)}
            disabled={!resource.fileUrl}
          >
            {resource.fileUrl ? 'Download' : 'Unavailable'}
          </Button>
        </Stack>
      </Box>
    </Box>
  )
}
