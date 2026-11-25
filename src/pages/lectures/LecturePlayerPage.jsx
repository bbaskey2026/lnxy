import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Avatar,
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  LinearProgress,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import {
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Download,
  Play,
} from 'lucide-react'
import { useAppFeedback } from '../../hooks/useAppFeedback'
import {
  saveLectureNote,
  fetchLectures,
  selectLecture,
  toggleCompleted,
  toggleLectureBookmark,
  updateProgress,
} from '../../store/slices/lectureSlice'

export default function LecturePlayerPage() {
  const { lectureId } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { showToast } = useAppFeedback()
  const videoRef = useRef(null)
  const { items, selectedLectureId, notes, loading, error } = useSelector((state) => state.lectures)
  const [speed, setSpeed] = useState('1')
  const [noteDraft, setNoteDraft] = useState('')

  useEffect(() => {
    if (!items.length) dispatch(fetchLectures())
  }, [dispatch, items.length])

  useEffect(() => {
    const matchingId = items.some((item) => item.id === lectureId) ? lectureId : selectedLectureId
    dispatch(selectLecture(matchingId))
  }, [dispatch, lectureId, items, selectedLectureId])

  const activeId = items.some((item) => item.id === lectureId) ? lectureId : selectedLectureId
  const activeIndex = Math.max(0, items.findIndex((item) => item.id === activeId))
  const lecture = items[activeIndex] ?? items[0]

  useEffect(() => {
    setNoteDraft(notes[lecture?.id] ?? '')
  }, [lecture?.id, notes])

  useEffect(() => {
    const video = videoRef.current
    if (!video || !lecture?.seconds) return
    video.currentTime = lecture.seconds
  }, [lecture?.id, lecture?.seconds])

  if (!lecture) {
    return (
      <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1000, mx: 'auto' }}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {loading ? (
          <Box sx={{ py: 8, display: 'grid', placeItems: 'center' }}><CircularProgress /></Box>
        ) : (
          <Box sx={{ p: 5, textAlign: 'center', bgcolor: 'white', border: '1px solid #e9edf4' }}>
            <Typography fontWeight={800}>No lectures available</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>Published lectures will appear here.</Typography>
          </Box>
        )}
      </Box>
    )
  }

  const completedCount = items.filter((item) => item.completed).length
  const courseProgress = Math.round((completedCount / items.length) * 100)

  const changeLecture = (direction) => {
    const nextIndex = activeIndex + direction
    if (nextIndex < 0 || nextIndex >= items.length) return
    navigate(`/student/lectures/${items[nextIndex].id}`)
  }

  const saveProgress = () => {
    const video = videoRef.current
    if (video) dispatch(updateProgress({ lectureId: lecture.id, seconds: Math.floor(video.currentTime) }))
  }

  const downloadAttachment = () => {
    if (!lecture.attachmentUrl) return
    const link = document.createElement('a')
    link.href = lecture.attachmentUrl
    link.target = '_blank'
    link.rel = 'noreferrer'
    document.body.appendChild(link)
    link.click()
    link.remove()
  }

  return (
    <Box sx={{ p: { xs: 1.5, md: 3 }, maxWidth: 1400, mx: 'auto' }}>
      <Button startIcon={<ArrowLeft size={16} />} onClick={() => navigate(-1)} sx={{ mb: 1.5 }}>Back</Button>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 1fr) 330px' }, gap: 2 }}>
        <Box>
          <Box sx={{ bgcolor: '#111827', borderRadius: 2.5, overflow: 'hidden', position: 'relative', aspectRatio: '16 / 9' }}>
            {lecture.videoSource ? (
              <video
                ref={videoRef}
                controls
                style={{ width: '100%', height: '100%', display: 'block' }}
                src={lecture.videoSource}
                onPause={saveProgress}
                onEnded={() => dispatch(toggleCompleted(lecture.id))}
                onLoadedMetadata={(event) => {
                  event.currentTarget.playbackRate = Number(speed)
                  if (lecture.seconds) event.currentTarget.currentTime = lecture.seconds
                }}
              >
                Your browser does not support video playback.
              </video>
            ) : (
              <Box sx={{ width: '100%', height: '100%', display: 'grid', placeItems: 'center', color: 'white', textAlign: 'center', p: 3 }}>
                <Box>
                  <Avatar sx={{ width: 66, height: 66, bgcolor: 'rgba(255,255,255,.12)', mx: 'auto', mb: 2 }}>
                    <Play size={28} fill="white" />
                  </Avatar>
                  <Typography variant="h6">Video not available yet</Typography>
                  <Typography variant="body2" sx={{ opacity: 0.75, mt: 1, maxWidth: 480 }}>
                    A video link has not been added to this lecture.
                  </Typography>
                </Box>
              </Box>
            )}
          </Box>

          <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} sx={{ mt: 2, gap: 1.5 }}>
            <Box>
              <Chip label={lecture.module} size="small" sx={{ mb: 1 }} />
              <Typography variant="h5">{lecture.title}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                Duration {lecture.duration}
              </Typography>
            </Box>
            <Stack direction="row" spacing={1}>
              <Select
                size="small"
                value={speed}
                aria-label="Playback speed"
                onChange={(event) => {
                  setSpeed(event.target.value)
                  if (videoRef.current) videoRef.current.playbackRate = Number(event.target.value)
                }}
                sx={{ minWidth: 82 }}
              >
                {[0.75, 1, 1.25, 1.5, 2].map((value) => <MenuItem key={value} value={String(value)}>{value}x</MenuItem>)}
              </Select>
              <IconButton
                aria-label={lecture.bookmark ? 'Remove lecture bookmark' : 'Bookmark lecture'}
                color={lecture.bookmark ? 'primary' : 'default'}
                onClick={() => dispatch(toggleLectureBookmark(lecture.id))}
              >
                {lecture.bookmark ? <BookmarkCheck /> : <Bookmark />}
              </IconButton>
              <IconButton aria-label="Download lecture attachment" onClick={downloadAttachment} disabled={!lecture.attachmentUrl}>
                <Download />
              </IconButton>
              <Button
                variant={lecture.completed ? 'outlined' : 'contained'}
                startIcon={<CheckCircle2 size={17} />}
                onClick={() => dispatch(toggleCompleted(lecture.id))}
              >
                {lecture.completed ? 'Completed' : 'Mark complete'}
              </Button>
            </Stack>
          </Stack>

          <Box sx={{ mt: 3, p: 2.5, bgcolor: 'white', border: '1px solid #e9edf4', borderRadius: 2.5 }}>
            <Typography variant="h6">Personal notes</Typography>
            <TextField
              multiline
              minRows={4}
              fullWidth
              value={noteDraft}
              onChange={(event) => setNoteDraft(event.target.value)}
              placeholder="Write a note for this lecture..."
              sx={{ mt: 1.5 }}
            />
            <Button
              variant="contained"
              sx={{ mt: 1.5 }}
              onClick={() => {
                dispatch(saveLectureNote({ lectureId: lecture.id, note: noteDraft }))
                showToast('Note saved successfully.')
              }}
            >
              Save note
            </Button>
          </Box>
        </Box>

        <Box sx={{ bgcolor: 'white', border: '1px solid #e9edf4', borderRadius: 2.5, height: 'fit-content', overflow: 'hidden' }}>
          <Box sx={{ p: 2 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography fontWeight={800}>Course content</Typography>
              <Typography variant="caption" fontWeight={800}>{courseProgress}%</Typography>
            </Stack>
            <LinearProgress variant="determinate" value={courseProgress} sx={{ mt: 1, height: 6, borderRadius: 99 }} />
          </Box>
          <Box>
            {items.map((item) => (
              <Box
                key={item.id}
                role="button"
                tabIndex={0}
                onClick={() => navigate(`/student/lectures/${item.id}`)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') navigate(`/student/lectures/${item.id}`)
                }}
                sx={{
                  px: 2,
                  py: 1.5,
                  borderTop: '1px solid #edf0f5',
                  cursor: 'pointer',
                  bgcolor: item.id === lecture.id ? 'primary.light' : 'transparent',
                  '&:hover': { bgcolor: item.id === lecture.id ? 'primary.light' : '#f8fafc' },
                }}
              >
                <Stack direction="row" spacing={1} alignItems="flex-start">
                  {item.completed
                    ? <CheckCircle2 size={18} color="#16a34a" />
                    : <Avatar sx={{ width: 22, height: 22, bgcolor: '#edf0f5', color: 'text.secondary', fontSize: 10 }}>{items.indexOf(item) + 1}</Avatar>}
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="body2" fontWeight={800} noWrap>{item.title}</Typography>
                    <Typography variant="caption" color="text.secondary">{item.duration}</Typography>
                  </Box>
                  {item.bookmark && <BookmarkCheck size={16} color="#4361ee" />}
                </Stack>
              </Box>
            ))}
          </Box>
          <Stack direction="row" justifyContent="space-between" sx={{ p: 2, borderTop: '1px solid #edf0f5' }}>
            <Button startIcon={<ChevronLeft size={16} />} disabled={activeIndex === 0} onClick={() => changeLecture(-1)}>Previous</Button>
            <Button endIcon={<ChevronRight size={16} />} disabled={activeIndex === items.length - 1} onClick={() => changeLecture(1)}>Next</Button>
          </Stack>
        </Box>
      </Box>
    </Box>
  )
}
