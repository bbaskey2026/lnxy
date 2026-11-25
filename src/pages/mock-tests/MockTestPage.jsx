import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  FormControl,
  LinearProgress,
  RadioGroup,
  Stack,
  Typography,
} from '@mui/material'
import {
  ArrowLeft,
  Bookmark,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  CircleX,
  Clock3,
  FileCheck2,
  RotateCcw,
  Send,
  SkipForward,
  Target,
  Trophy,
} from 'lucide-react'
import ConfirmationDialog from '../../components/ConfirmationDialog'
import {
  AnswerOption,
  QuestionPalette,
  ResultMetric,
  SolutionCard,
} from '../../components/mock-tests/MockTestUI'
import { mockTestActionSx } from '../../components/mock-tests/mockTestStyles'
import {
  clearAnswer,
  fetchMockTest,
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

const emptyQuestions = []

export default function MockTestPage() {
  const { testId } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const mockState = useSelector((state) => state.mockTests)
  const [submitOpen, setSubmitOpen] = useState(false)

  const test = mockState.availableTests.find((item) => item.id === testId)
  const questions = test?.questions ?? emptyQuestions
  const isTestHydrated = Array.isArray(test?.questions)

  useEffect(() => {
    if (!isTestHydrated) dispatch(fetchMockTest(testId))
  }, [dispatch, isTestHydrated, testId])

  useEffect(() => {
    if (isTestHydrated && (mockState.testStatus === 'idle' || mockState.selectedTestId !== testId)) {
      dispatch(restoreTest(testId))
    }
  }, [dispatch, isTestHydrated, mockState.selectedTestId, mockState.testStatus, testId])

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

  const answeredCount = useMemo(() => (
    questions.reduce((count, question) => (
      mockState.answers[question.id] === undefined ? count : count + 1
    ), 0)
  ), [mockState.answers, questions])
  const question = questions[mockState.activeQuestionIndex]
  const progress = questions.length ? (answeredCount / questions.length) * 100 : 0

  if (!isTestHydrated || !question) {
    return (
      <Box sx={{ minHeight: 'calc(100vh - 72px)', p: { xs: 2, md: 4 }, bgcolor: '#f5f7fb' }}>
        <Box sx={{ maxWidth: 720, mx: 'auto', p: { xs: 2.5, sm: 3 }, bgcolor: 'white', border: '1px solid #e3e7ef' }}>
          {mockState.loading ? (
            <Stack spacing={1.5} alignItems="center" sx={{ py: 4 }}>
              <CircularProgress size={26} sx={{ color: '#0b5cff' }} />
              <Typography variant="body2" color="text.secondary">Loading test questions…</Typography>
            </Stack>
          ) : (
            <>
              <Alert severity={mockState.error ? 'error' : 'info'} sx={{ mb: 2, borderRadius: 12 }}>
                {mockState.error ?? 'This test could not be found.'}
              </Alert>
              {mockState.error && (
                <Button onClick={() => dispatch(fetchMockTest(testId))} sx={{ mr: 1, borderRadius: 12, color: '#c2410c' }}>
                  Try again
                </Button>
              )}
              <Button startIcon={<ArrowLeft size={16} />} onClick={() => navigate('/student/mock-tests')} sx={{ borderRadius: 12 }}>
                Back to mock tests
              </Button>
            </>
          )}
        </Box>
      </Box>
    )
  }

  if (mockState.testStatus === 'submitted' && mockState.result) {
    return <TestResultPage test={test} state={mockState} onBack={() => navigate('/student/mock-tests')} />
  }

  const selectedOption = mockState.answers[question.id]
  const reviewed = mockState.reviewIds.includes(question.id)
  const timerIsLow = mockState.timerSeconds < 300

  return (
    <Box sx={{ minHeight: 'calc(100vh - 72px)', pb: 4, bgcolor: '#f5f7fb' }}>
      <Box sx={{ position: 'sticky', top: 72, zIndex: 3, bgcolor: 'white', borderBottom: '1px solid #e3e7ef' }}>
        <Box sx={{ maxWidth: 1440, mx: 'auto', px: { xs: 1.5, sm: 2.5, lg: 3.5 }, py: 1.5 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" gap={1.5}>
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ minWidth: 0 }}>
                <Box sx={{ width: 30, height: 30, flexShrink: 0, display: 'grid', placeItems: 'center', bgcolor: '#edf4ff', color: '#0847c6' }}>
                  <FileCheck2 size={16} />
                </Box>
                <Box sx={{ minWidth: 0 }}>
                  <Typography sx={{ fontSize: 14, lineHeight: 1.3, fontWeight: 800 }} noWrap>{test.title}</Typography>
                  <Typography variant="caption" color="text.secondary" noWrap>{test.examination}</Typography>
                </Box>
              </Stack>
            </Box>

            <Stack direction="row" alignItems="center" spacing={{ xs: 0.75, sm: 1.5 }}>
              <Box
                sx={{
                  px: { xs: 1, sm: 1.5 },
                  py: 0.75,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.75,
                  border: '1px solid',
                  borderColor: timerIsLow ? '#fecaca' : '#e3e7ef',
                  bgcolor: timerIsLow ? '#fef2f2' : '#f8fafc',
                  color: timerIsLow ? '#b91c1c' : '#273449',
                }}
              >
                <Clock3 size={16} />
                <Typography component="time" aria-label="Time remaining" sx={{ fontSize: 15, fontWeight: 900, fontVariantNumeric: 'tabular-nums' }}>
                  {formatTime(mockState.timerSeconds)}
                </Typography>
              </Box>
              <Button
                variant="contained"
                startIcon={<Send size={15} />}
                onClick={() => setSubmitOpen(true)}
                sx={{ ...mockTestActionSx, minHeight: 40, px: { xs: 1.25, sm: 2 } }}
              >
                <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>Submit test</Box>
                <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>Submit</Box>
              </Button>
            </Stack>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={1.25} sx={{ mt: 1.5 }}>
            <LinearProgress
              variant="determinate"
              value={progress}
              aria-label={`${answeredCount} of ${questions.length} questions answered`}
              sx={{
                flex: 1,
                height: 4,
                bgcolor: '#edf0f5',
                '& .MuiLinearProgress-bar': { bgcolor: '#0b5cff' },
              }}
            />
            <Typography variant="caption" color="text.secondary" sx={{ minWidth: 72, textAlign: 'right' }}>
              {answeredCount}/{questions.length} answered
            </Typography>
          </Stack>
        </Box>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 1fr) 300px' },
          gap: 2,
          maxWidth: 1440,
          mx: 'auto',
          p: { xs: 1.5, sm: 2.5, lg: 3.5 },
        }}
      >
        <Box sx={{ minWidth: 0, bgcolor: 'white', border: '1px solid #e3e7ef' }}>
          <Box sx={{ px: { xs: 2, sm: 3 }, py: 2, borderBottom: '1px solid #edf0f5' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" gap={1.5}>
              <Box>
                <Typography variant="overline" sx={{ color: '#c2410c', fontWeight: 800, letterSpacing: '.1em', lineHeight: 1.4 }}>
                  QUESTION {String(mockState.activeQuestionIndex + 1).padStart(2, '0')}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  of {String(questions.length).padStart(2, '0')}
                </Typography>
              </Box>
              <Stack direction="row" spacing={0.75} alignItems="center">
                {question.subject && (
                  <Box sx={{ px: 1, py: 0.5, bgcolor: '#f5f7fb', color: '#475467' }}>
                    <Typography variant="caption" fontWeight={700}>{question.subject}</Typography>
                  </Box>
                )}
                <Button
                  size="small"
                  startIcon={<Bookmark size={15} />}
                  aria-pressed={reviewed}
                  onClick={() => dispatch(toggleReview(question.id))}
                  sx={{
                    minWidth: 0,
                    borderRadius: 12,
                    color: reviewed ? '#232323' : '#667085',
                    bgcolor: reviewed ? '#edf4ff' : 'transparent',
                    '&:hover': { bgcolor: '#edf4ff' },
                  }}
                >
                  <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                    {reviewed ? 'Marked' : 'Mark for review'}
                  </Box>
                  <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>
                    {reviewed ? 'Marked' : 'Review'}
                  </Box>
                </Button>
              </Stack>
            </Stack>
          </Box>

          <Box sx={{ px: { xs: 2, sm: 3 }, py: { xs: 2.5, sm: 3.5 } }}>
            <Typography component="h1" sx={{ mb: 3, fontSize: { xs: 17, sm: 20 }, lineHeight: 1.55, fontWeight: 750, color: '#232323' }}>
              {question.text}
            </Typography>
            <FormControl component="fieldset" fullWidth>
              <Typography component="legend" variant="caption" color="text.secondary" sx={{ mb: 1.25 }}>
                Choose one answer
              </Typography>
              <RadioGroup
                aria-label={`Answers for question ${mockState.activeQuestionIndex + 1}`}
                value={selectedOption === undefined ? '' : String(selectedOption)}
                onChange={(_, value) => dispatch(saveAnswer({ questionId: question.id, optionIndex: Number(value) }))}
                sx={{ gap: 1 }}
              >
                {question.options.map((option, index) => (
                  <AnswerOption
                    key={`${question.id}-${index}`}
                    index={index}
                    option={option}
                    selected={selectedOption === index}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </Box>

          <Divider />
          <Stack
            direction={{ xs: 'column-reverse', sm: 'row' }}
            justifyContent="space-between"
            alignItems={{ xs: 'stretch', sm: 'center' }}
            gap={1}
            sx={{ px: { xs: 2, sm: 3 }, py: 2 }}
          >
            <Button
              startIcon={<RotateCcw size={15} />}
              disabled={selectedOption === undefined}
              onClick={() => dispatch(clearAnswer(question.id))}
              sx={{ borderRadius: 12, color: '#667085', justifyContent: { xs: 'flex-start', sm: 'center' } }}
            >
              Clear response
            </Button>
            <Stack direction="row" justifyContent="space-between" gap={1}>
              <Button
                variant="outlined"
                startIcon={<ChevronLeft size={16} />}
                disabled={mockState.activeQuestionIndex === 0}
                onClick={() => dispatch(setActiveQuestion(mockState.activeQuestionIndex - 1))}
                sx={{ borderRadius: 12, borderColor: '#d8dde7', color: '#344054' }}
              >
                Previous
              </Button>
              <Button
                variant={mockState.activeQuestionIndex === questions.length - 1 ? 'contained' : 'outlined'}
                endIcon={mockState.activeQuestionIndex === questions.length - 1 ? <Check size={16} /> : <ChevronRight size={16} />}
                onClick={() => {
                  if (mockState.activeQuestionIndex < questions.length - 1) {
                    dispatch(setActiveQuestion(mockState.activeQuestionIndex + 1))
                  } else {
                    setSubmitOpen(true)
                  }
                }}
                sx={mockState.activeQuestionIndex === questions.length - 1
                  ? { ...mockTestActionSx, minHeight: 40 }
                  : { borderRadius: 12, borderColor: '#d8dde7', color: '#344054' }}
              >
                {mockState.activeQuestionIndex === questions.length - 1 ? 'Review and submit' : 'Next question'}
              </Button>
            </Stack>
          </Stack>
        </Box>

        <Stack spacing={2} sx={{ alignSelf: 'start', position: { lg: 'sticky' }, top: { lg: 174 } }}>
          <QuestionPalette
            questions={questions}
            answers={mockState.answers}
            reviewIds={mockState.reviewIds}
            activeIndex={mockState.activeQuestionIndex}
            onSelect={(index) => dispatch(setActiveQuestion(index))}
          />
          <Box sx={{ p: 2, bgcolor: 'white', border: '1px solid #e3e7ef' }}>
            <Typography sx={{ fontSize: 14, fontWeight: 800, mb: 1 }}>Before you submit</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.65 }}>
              Review any unanswered or marked questions. Your responses are saved in this browser while you work.
            </Typography>
          </Box>
        </Stack>
      </Box>

      <ConfirmationDialog
        open={submitOpen}
        title="Submit this test?"
        description={(
          <>
            <Typography>
              You have answered {answeredCount} of {questions.length} questions.
            </Typography>
            {mockState.reviewIds.length > 0 && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
                {mockState.reviewIds.length} question{mockState.reviewIds.length === 1 ? '' : 's'} marked for review.
              </Typography>
            )}
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              You cannot change your answers after submitting.
            </Typography>
          </>
        )}
        cancelLabel="Continue test"
        confirmLabel="Submit now"
        confirmColor="error"
        onCancel={() => setSubmitOpen(false)}
        onConfirm={() => {
          setSubmitOpen(false)
          dispatch(submitTest())
        }}
      />
    </Box>
  )
}

function TestResultPage({ test, state, onBack }) {
  const result = state.result
  const consumed = `${Math.floor(result.timeConsumedSeconds / 60)}m ${result.timeConsumedSeconds % 60}s`

  return (
    <Box sx={{ minHeight: 'calc(100vh - 72px)', pb: 5, bgcolor: '#f5f7fb' }}>
      <Box sx={{ maxWidth: 1280, mx: 'auto', px: { xs: 2, sm: 3, lg: 4 }, pt: { xs: 2.5, md: 4 } }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} gap={2} sx={{ mb: 2.5 }}>
          <Box>
            <Typography variant="overline" sx={{ color: '#c2410c', fontWeight: 800, letterSpacing: '.12em' }}>
              PRACTICE COMPLETE
            </Typography>
            <Typography component="h1" sx={{ fontSize: { xs: 25, sm: 30 }, lineHeight: 1.2, fontWeight: 850, letterSpacing: '-.03em', color: '#232323' }}>
              Your test result
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>{test.title}</Typography>
          </Box>
          <Button
            variant="outlined"
            startIcon={<ArrowLeft size={16} />}
            onClick={onBack}
            sx={{ borderRadius: 12, borderColor: '#d8dde7', color: '#344054', minHeight: 40 }}
          >
            Back to tests
          </Button>
        </Stack>

        {result.obtainedMarks < 0 && (
          <Alert severity="warning" sx={{ mb: 2, borderRadius: 12 }}>
            Negative marking brought your score below zero. Review missed questions to improve your next attempt.
          </Alert>
        )}

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1fr) auto' },
            alignItems: 'center',
            gap: 3,
            p: { xs: 2.5, sm: 3.5 },
            mb: 2,
            color: 'white',
            bgcolor: '#232323',
            backgroundImage: 'linear-gradient(112deg, #111111 0%, #232323 68%, #0b5cff 100%)',
          }}
        >
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box sx={{ width: 46, height: 46, display: 'grid', placeItems: 'center', bgcolor: 'rgba(255,255,255,.1)', color: '#ffb37d' }}>
              <Trophy size={22} />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,.7)' }}>SCORE</Typography>
              <Typography sx={{ fontSize: 25, lineHeight: 1.2, fontWeight: 850 }}>
                {result.obtainedMarks} <Box component="span" sx={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,.7)' }}>/ {result.totalMarks} marks</Box>
              </Typography>
            </Box>
          </Stack>
          <Stack direction="row" spacing={1.25} alignItems="center">
            <Box sx={{ width: 60, height: 60, display: 'grid', placeItems: 'center', border: '1px solid rgba(255,255,255,.24)', borderRadius: '50%' }}>
              <Typography sx={{ fontSize: 16, fontWeight: 850 }}>{result.accuracy}%</Typography>
            </Box>
            <Box>
              <Typography sx={{ fontSize: 14, fontWeight: 800 }}>Accuracy</Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,.7)' }}>of attempted answers</Typography>
            </Box>
          </Stack>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, minmax(0, 1fr))', sm: 'repeat(4, minmax(0, 1fr))' }, gap: 1.25, mb: 2 }}>
          <ResultMetric icon={CircleCheck} label="Correct" value={result.correct} color="#15803d" />
          <ResultMetric icon={CircleX} label="Incorrect" value={result.incorrect} color="#dc2626" />
          <ResultMetric icon={SkipForward} label="Unanswered" value={result.unattempted} color="#667085" />
          <ResultMetric icon={Clock3} label="Time used" value={consumed} color="#0b5cff" />
        </Box>

        <Box sx={{ p: { xs: 2, sm: 2.5 }, bgcolor: 'white', border: '1px solid #e3e7ef' }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" gap={1} sx={{ mb: 0.5 }}>
            <Box>
              <Typography sx={{ fontSize: 16, fontWeight: 800 }}>Answer review</Typography>
              <Typography variant="caption" color="text.secondary">
                Review each response and read the explanation.
              </Typography>
            </Box>
            <Box sx={{ display: { xs: 'none', sm: 'grid' }, width: 36, height: 36, placeItems: 'center', bgcolor: '#edf4ff', color: '#0847c6' }}>
              <Target size={17} />
            </Box>
          </Stack>
          {test.questions.map((question, index) => (
            <SolutionCard
              key={question.id}
              question={question}
              index={index}
              answer={state.answers[question.id]}
            />
          ))}
          <Button
            variant="contained"
            startIcon={<RotateCcw size={16} />}
            onClick={onBack}
            sx={{ ...mockTestActionSx, mt: 1 }}
          >
            Choose another test
          </Button>
        </Box>
      </Box>
    </Box>
  )
}
