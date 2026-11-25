import { useEffect, useState } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import { ImageOff } from 'lucide-react'

export default function ContentPreviewImage({
  title,
  category,
  imageUrl,
  kind = 'resource',
  height = 172,
}) {
  const [imageFailed, setImageFailed] = useState(false)

  useEffect(() => {
    setImageFailed(false)
  }, [imageUrl])

  return (
    <Box
      role="img"
      aria-label={`${title} ${kind === 'article' ? 'article' : 'resource'} preview`}
      sx={{ height, overflow: 'hidden', bgcolor: '#eef1f7' }}
    >
      {imageUrl && !imageFailed ? (
        <Box
          component="img"
          src={imageUrl}
          alt=""
          loading="lazy"
          decoding="async"
          onError={() => setImageFailed(true)}
          sx={{ width: '100%', height: '100%', display: 'block', objectFit: 'cover' }}
        />
      ) : (
        <Stack
          alignItems="center"
          justifyContent="center"
          spacing={0.75}
          sx={{ width: '100%', height: '100%', color: '#667085', textAlign: 'center', px: 2 }}
        >
          <ImageOff size={23} strokeWidth={1.6} />
          <Typography variant="caption" fontWeight={700}>
            {imageUrl ? 'Preview image unavailable' : `${category || 'Content'} preview`}
          </Typography>
        </Stack>
      )}
    </Box>
  )
}
