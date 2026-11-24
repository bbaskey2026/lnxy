import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Radio,
  Stack,
  Typography,
} from '@mui/material'
import {
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Clock3,
  RotateCcw,
  Send,
} from 'lucide-react'
import {
  clearAnswer,
  restoreTest,
  saveAnswer,
  setActiveQuestion,
  submitTest,
  tickTimer,
  toggleReview,
} from '../../store/slices/mockTestSlice'

const formatTime = (seconds) => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remaining = seconds % 60
  return hours
    ? `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(remaining).padStart(2, '0')}`
    : `${String(minutes).padStart(2, '0')}:${String(remaining).padStart(2, '0')}`
}

export default function MockTestPage() {
  const { testId } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const mockState = useSelector((state) => state.mockTests)
  const [submitOpen, setSubmitOpen] = useState(false)

  useEffect(() => {
    if (mockState.testStatus === 'idle') dispatch(restoreTest(testId))
  }, [dispatch, testId, mockState.testStatus])

  useEffect(() => {
    if (mockState.testStatus !== 'in_progress') return undefined
    const interval = window.setInterval(() => dispatch(tickTimer()), 1000)
    return () => window.clearInterval(interval)
  }, [dispatch, mockState.testStatus])

  useEffect(() => {
    if (mockState.testStatus === 'in_progress' && mockState.timerSeconds === 0) {
      dispatch(submitTest())
    }
  }, [dispatch, mockState.testStatus, mockState.timerSeconds])

  const test = mockState.availableTests.find((item) => item.id === (mockState.selectedTestId ?? testId))
  const question = test?.questions[mockState.activeQuestionIndex]

  const counts = useMemo(() => ({
    answered: Object.keys(mockState.answers).length,
    unanswered: test ? test.questions.length - Object.keys(mockState.answers).length : 0,
  }), [mockState.answers, test])

  if (!test || !question) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Test not found.</Typography>
        <Button onClick={() => navigate('/student/mock-tests')}>Back to mock tests</Button>
      </Box>
    )
  }

  if (mockState.testStatus === 'submitted' && mockState.result) {
    return <TestResultPage test={test} state={mockState} onRetake={() => navigate('/student/mock-tests')} />
  }

  const selectedOption = mockState.answers[question.id]
  const reviewed = mockState.reviewIds.includes(question.id)

  return (
    <Box sx={{ minHeight: 'calc(100vh - 72px)', bgcolor: '#f5f7fb' }}>
      <Box sx={{ px: { xs: 2, md: 3 }, py: 1.5, bgcolor: 'white', borderBottom: '1px solid #e9edf4', position: 'sticky', top: 72, zIndex: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" gap={1}>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="body2" fontWeight={800} noWrap>{test.title}</Typography>
            <Typography variant="caption" color="text.secondary">{counts.answered} answered • {counts.unanswered} unanswered</Typography>
          </Box>
          <Chip
            icon={<Clock3 size={16} />}
            label={formatTime(mockState.timerSeconds)}
            color={mockState.timerSeconds < 300 ? 'error' : 'primary'}
            sx={{ fontWeight: 900, fontSize: 15 }}
          />
          <Button variant="contained" color="error" startIcon={<Send size={16} />} onClick={() => setSubmitOpen(true)}>Submit</Button>
        </Stack>
      </Box>

      <Box sx={{ p: { xs: 1.5, md: 3 }, display: 'grid', gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 1fr) 300px' }, gap: 2 }}>
        <Box sx={{ bgcolor: 'white', border: '1px solid #e9edf4', borderRadius: 2.5, p: { xs: 2, md: 3 } }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Typography fontWeight={800}>Question {mockState.activeQuestionIndex + 1} of {test.questions.length}</Typography>
            <Chip label={question.subject} size="small" />
          </Stack>
          <Typography variant="h6" sx={{ lineHeight: 1.5, mb: 3 }}>{question.text}</Typography>
          <Box sx={{ display: 'grid', gap: 1.25 }}>
            {question.options.map((option, index) => (
              <Box
                key={option}
                onClick={() => dispatch(saveAnswer({ questionId: question.id, optionIndex: index }))}
                sx={{
                  p: 1.25,
                  border: '1px solid',
                  borderColor: selectedOption === index ? 'primary.main' : '#e9edf4',
                  bgcolor: selectedOption === index ? 'primary.light' : 'white',
                  borderRadius: 2,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Radio checked={selectedOption === index} readOnly sx={{ p: 0.5, mr: 1 }} />
                <Typography>{option}</Typography>
              </Box>
            ))}
          </Box>
          <Divider sx={{ my: 3 }} />
          <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={1}>
            <Stack direction="row" spacing={1}>
              <Button startIcon={<ChevronLeft size={16} />} disabled={mockState.activeQuestionIndex === 0}
                onClick={() => dispatch(setActiveQuestion(mockState.activeQuestionIndex - 1))}>Previous</Button>
              <Button endIcon={<ChevronRight size={16} />} disabled={mockState.activeQuestionIndex === test.questions.length - 1}
                onClick={() => dispatch(setActiveQuestion(mockState.activeQuestionIndex + 1))}>Next</Button>
            </Stack>
            <Stack direction="row" spacing={1}>
              <Button startIcon={<RotateCcw size={16} />} disabled={selectedOption === undefined}
                onClick={() => dispatch(clearAnswer(question.id))}>Clear</Button>
              <Button
                startIcon={<Bookmark size={16} />}
                variant={reviewed ? 'contained' : 'outlined'}
                onClick={() => dispatch(toggleReview(question.id))}
              >
                {reviewed ? 'Marked' : 'Review'}
              </Button>
            </Stack>
          </Stack>
        </Box>

        <Box sx={{ bgcolor: 'white', border: '1px solid #e9edf4', borderRadius: 2.5, p: 2, height: 'fit-content' }}>
          <Typography fontWeight={800} sx={{ mb: 1.5 }}>Question palette</Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 1 }}>
            {test.questions.map((item, index) => {
              const isAnswered = mockState.answers[item.id] !== undefined
              const isReview = mockState.reviewIds.includes(item.id)
              return (
                <Button
                  key={item.id}
                  variant={mockState.activeQuestionIndex === index ? 'contained' : 'outlined'}
                  onClick={() => dispatch(setActiveQuestion(index))}
                  sx={{
                    minWidth: 0,
                    p: 0,
                    height: 42,
                    bgcolor: mockState.activeQuestionIndex !== index && isAnswered ? '#16a34a' : undefined,
                    color: mockState.activeQuestionIndex !== index && isAnswered ? 'white' : undefined,
                    borderColor: isReview ? '#f59e0b' : undefined,
                  }}
                >
                  {index + 1}
                </Button>
              )
            })}
          </Box>
          <Stack spacing={0.75} sx={{ mt: 2 }}>
            <Typography variant="caption"><span style={{ color: '#16a34a', fontWeight: 800 }}>■</span> Answered</Typography>
            <Typography variant="caption"><span style={{ color: '#4361ee', fontWeight: 800 }}>■</span> Current</Typography>
            <Typography variant="caption"><span style={{ color: '#f59e0b', fontWeight: 800 }}>■</span> Marked for review</Typography>
          </Stack>
        </Box>
      </Box>

      <Dialog open={submitOpen} onClose={() => setSubmitOpen(false)}>
        <DialogTitle>Submit examination?</DialogTitle>
        <DialogContent>
          <Typography>You have answered {counts.answered} of {test.questions.length} questions.</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Submitted answers cannot be changed.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSubmitOpen(false)}>Continue test</Button>
          <Button color="error" variant="contained" onClick={() => {
            setSubmitOpen(false)
            dispatch(submitTest())
          }}>Submit now</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

function TestResultPage({ test, state, onRetake }) {
  const result = state.result
  const consumed = `${Math.floor(result.timeConsumedSeconds / 60)}m ${result.timeConsumedSeconds % 60}s`
  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1120, mx: 'auto' }}>
      <Typography variant="h4" sx={{ mb: 0.5 }}>Test Result</Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>{test.title}</Typography>
      {result.obtainedMarks < 0 && <Alert severity="warning" sx={{ mb: 2 }}>Negative marking was applied to incorrect responses.</Alert>}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 2, mb: 3 }}>
        {[
          ['Obtained marks', `${result.obtainedMarks} / ${result.totalMarks}`, 'primary.main'],
          ['Correct', result.correct, 'success.main'],
          ['Incorrect', result.incorrect, 'error.main'],
          ['Unattempted', result.unattempted, 'text.secondary'],
        ].map(([label, value, color]) => (
          <Box key={label} sx={{ p: 2.5, bgcolor: 'white', border: '1px solid #e9edf4', borderRadius: 2.5 }}>
            <Typography variant="body2" color="text.secondary">{label}</Typography>
            <Typography variant="h5" sx={{ mt: 0.75, color }}>{value}</Typography>
          </Box>
        ))}
      </Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '360px 1fr' }, gap: 2 }}>
        <Box sx={{ p: 2.5, bgcolor: 'white', border: '1px solid #e9edf4', borderRadius: 2.5 }}>
          <Typography fontWeight={800}>Performance</Typography>
          <Typography variant="h3" sx={{ mt: 2, color: 'primary.main' }}>{result.accuracy}%</Typography>
          <Typography variant="body2" color="text.secondary">Accuracy</Typography>
          <Divider sx={{ my: 2 }} />
          <Stack spacing={1}>
            <Stack direction="row" justifyContent="space-between"><Typography variant="body2" color="text.secondary">Time consumed</Typography><Typography fontWeight={800}>{consumed}</Typography></Stack>
            <Stack direction="row" justifyContent="space-between"><Typography variant="body2" color="text.secondary">Rank / percentile</Typography><Typography fontWeight={800}>Available with comparison data</Typography></Stack>
          </Stack>
        </Box>
        <Box sx={{ p: 2.5, bgcolor: 'white', border: '1px solid #e9edf4', borderRadius: 2.5 }}>
          <Typography fontWeight={800} sx={{ mb: 2 }}>Solutions</Typography>
          {test.questions.map((question, index) => {
            const answer = state.answers[question.id]
            const correct = answer === question.correctIndex
            return (
              <Box key={question.id} sx={{ py: 1.5, borderTop: index ? '1px solid #edf0f5' : 'none' }}>
                <Stack direction="row" justifyContent="space-between" gap={1}>
                  <Typography variant="body2" fontWeight={800}>{index + 1}. {question.text}</Typography>
                  <Chip label={answer === undefined ? 'Unattempted' : correct ? 'Correct' : 'Incorrect'} size="small" color={answer === undefined ? 'default' : correct ? 'success' : 'error'} />
                </Stack>
                <Typography variant="body2" sx={{ mt: 1 }}>Correct answer: <strong>{question.options[question.correctIndex]}</strong></Typography>
                {answer !== undefined && <Typography variant="body2" color="text.secondary">Your answer: {question.options[answer]}</Typography>}
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>{question.explanation}</Typography>
              </Box>
            )
          })}
          <Button variant="contained" startIcon={<RotateCcw size={16} />} onClick={onRetake} sx={{ mt: 2 }}>Back to tests</Button>
        </Box>
      </Box>
    </Box>
  )
}
