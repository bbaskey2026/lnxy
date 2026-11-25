import {
  Box,
  Button,
  Chip,
  FormControlLabel,
  Radio,
  Stack,
  Typography,
} from '@mui/material'
import {
  ArrowRight,
  BookOpen,
  Clock3,
  FileCheck2,
  Play,
  Users,
} from 'lucide-react'
import { mockTestActionSx } from './mockTestStyles'
import ExamLogo from '../ExamLogo'

export function MockTestCard({ test, onStart }) {
  const questionCount = test.questionCount ?? test.questions?.length ?? test.questionIds?.length ?? 0

  return (
    <Box
      component="article"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: 280,
        p: { xs: 2, sm: 2.5 },
        bgcolor: 'white',
        border: '1px solid #e3e7ef',
        transition: 'border-color .18s ease, box-shadow .18s ease, transform .18s ease',
        '&:hover': {
          borderColor: '#0b5cff',
          boxShadow: '0 12px 30px rgba(23, 32, 51, .08)',
          transform: 'translateY(-2px)',
        },
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center" gap={1} flexWrap="wrap">
        <Chip
          label={test.category}
          size="small"
          sx={{ borderRadius: 0, bgcolor: '#edf4ff', color: '#0847c6', fontWeight: 800 }}
        />
        <Stack direction="row" spacing={0.75} alignItems="center">
          <ExamLogo name={test.examination} size={24} />
          <Typography variant="caption" color="text.secondary" fontWeight={700}>
            {test.examination}
          </Typography>
        </Stack>
      </Stack>

      <Typography
        component="h2"
        sx={{ mt: 2, fontSize: 17, lineHeight: 1.4, fontWeight: 800, color: '#232323' }}
      >
        {test.title}
      </Typography>

      <Stack direction="row" useFlexGap flexWrap="wrap" gap={1.5} sx={{ mt: 2.25, mb: 2.5 }}>
        <Stack direction="row" spacing={0.75} alignItems="center" color="text.secondary">
          <Clock3 size={15} />
          <Typography variant="caption" fontWeight={700}>{test.durationSeconds / 60} min</Typography>
        </Stack>
        <Stack direction="row" spacing={0.75} alignItems="center" color="text.secondary">
          <FileCheck2 size={15} />
          <Typography variant="caption" fontWeight={700}>{questionCount} questions</Typography>
        </Stack>
        {test.attempted > 0 && (
          <Stack direction="row" spacing={0.75} alignItems="center" color="text.secondary">
            <Users size={15} />
            <Typography variant="caption" fontWeight={700}>{test.attempted.toLocaleString()} attempts</Typography>
          </Stack>
        )}
      </Stack>

      <Box sx={{ mt: 'auto', pt: 1.5, borderTop: '1px solid #edf0f5' }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" gap={1} sx={{ mb: 1.5 }}>
          <Typography variant="caption" color="text.secondary">Scoring</Typography>
          <Typography variant="caption" fontWeight={800}>
            +{test.positiveMarks} correct <Box component="span" sx={{ mx: 0.5, color: '#98a2b3' }}>·</Box>
            -{test.negativeMarks} incorrect
          </Typography>
        </Stack>
        <Button
          fullWidth
          variant="contained"
          startIcon={<Play size={16} />}
          endIcon={<ArrowRight size={16} />}
          onClick={onStart}
          sx={mockTestActionSx}
        >
          Start test
        </Button>
      </Box>
    </Box>
  )
}

export function MockTestStat({ icon: Icon = BookOpen, label, value, helper }) {
  return (
    <Stack direction="row" spacing={1.25} alignItems="center">
      <Box sx={{ width: 38, height: 38, display: 'grid', placeItems: 'center', bgcolor: 'rgba(255,255,255,.1)', color: '#ffb37d' }}>
        <Icon size={18} />
      </Box>
      <Box>
        <Typography sx={{ fontSize: 17, lineHeight: 1.2, fontWeight: 800, color: 'white' }}>{value}</Typography>
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,.7)' }}>{helper ?? label}</Typography>
      </Box>
    </Stack>
  )
}

export function ResultMetric({ icon: Icon, label, value, color = '#0b5cff' }) {
  return (
    <Box sx={{ p: 2, bgcolor: 'white', border: '1px solid #e3e7ef' }}>
      <Stack direction="row" spacing={1.25} alignItems="center">
        <Box sx={{ width: 36, height: 36, display: 'grid', placeItems: 'center', bgcolor: '#f5f7fb', color }}>
          <Icon size={17} />
        </Box>
        <Box>
          <Typography variant="caption" color="text.secondary">{label}</Typography>
          <Typography sx={{ mt: 0.25, fontSize: 17, lineHeight: 1.2, fontWeight: 800, color }}>{value}</Typography>
        </Box>
      </Stack>
    </Box>
  )
}

export function AnswerOption({ index, option, selected }) {
  const letter = String.fromCharCode(65 + index)

  return (
    <FormControlLabel
      value={String(index)}
      control={<Radio checked={selected} size="small" sx={{ color: '#98a2b3', '&.Mui-checked': { color: '#0b5cff' } }} />}
      label={(
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ py: 0.75 }}>
          <Box
            aria-hidden="true"
            sx={{
              width: 28,
              height: 28,
              flexShrink: 0,
              display: 'grid',
              placeItems: 'center',
              border: '1px solid #e3e7ef',
              color: '#667085',
              fontSize: 12,
              fontWeight: 800,
            }}
          >
            {letter}
          </Box>
          <Typography sx={{ fontSize: 14, lineHeight: 1.5, color: '#273449' }}>{option}</Typography>
        </Stack>
      )}
      sx={{
        m: 0,
        px: 1.25,
        minHeight: 58,
        border: '1px solid #e3e7ef',
        borderColor: selected ? '#0b5cff' : '#e3e7ef',
        bgcolor: 'white',
        alignItems: 'center',
        ...(selected && { bgcolor: '#fff7ed' }),
        '&:hover': { borderColor: '#0b5cff', bgcolor: '#edf4ff' },
        '& .MuiFormControlLabel-label': { flex: 1 },
      }}
    />
  )
}

export function QuestionPalette({
  questions,
  answers,
  reviewIds,
  activeIndex,
  onSelect,
}) {
  const answeredCount = questions.reduce((count, question) => (
    answers[question.id] === undefined ? count : count + 1
  ), 0)
  const reviewCount = reviewIds.length

  return (
    <Box sx={{ p: 2.25, bgcolor: 'white', border: '1px solid #e3e7ef' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
        <Typography sx={{ fontSize: 15, fontWeight: 800 }}>Question map</Typography>
        <Typography variant="caption" color="text.secondary">{questions.length} total</Typography>
      </Stack>
      <Typography variant="caption" color="text.secondary">
        {answeredCount} answered <Box component="span" sx={{ mx: 0.5 }}>·</Box> {reviewCount} for review
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, minmax(0, 1fr))',
          gap: 0.75,
          mt: 2,
        }}
      >
        {questions.map((question, index) => {
          const answered = answers[question.id] !== undefined
          const marked = reviewIds.includes(question.id)
          const current = activeIndex === index
          const status = [
            answered ? 'answered' : 'not answered',
            marked ? 'marked for review' : '',
            current ? 'current question' : '',
          ].filter(Boolean).join(', ')

          return (
            <Button
              key={question.id}
              aria-label={`Question ${index + 1}, ${status}`}
              aria-current={current ? 'step' : undefined}
              onClick={() => onSelect(index)}
              sx={{
                minWidth: 0,
                width: '100%',
                height: 40,
                p: 0,
                borderRadius: 0,
                border: '1px solid',
                borderColor: current ? '#0b5cff' : marked ? '#232323' : answered ? '#16a34a' : '#d8dde7',
                bgcolor: current ? '#0b5cff' : answered ? '#eaf7ef' : marked ? '#232323' : 'white',
                color: current ? 'white' : answered ? '#15803d' : '#475467',
                fontSize: 12,
                fontWeight: 800,
                '&:hover': { borderColor: '#0b5cff', bgcolor: current ? '#0847c6' : '#edf4ff' },
              }}
            >
              {index + 1}
            </Button>
          )
        })}
      </Box>

      <Stack spacing={0.75} sx={{ mt: 2 }}>
        {[
          ['#16a34a', 'Answered'],
          ['#232323', 'Marked for review'],
          ['#0b5cff', 'Current question'],
        ].map(([color, label]) => (
          <Stack key={label} direction="row" spacing={1} alignItems="center">
            <Box aria-hidden="true" sx={{ width: 9, height: 9, bgcolor: color }} />
            <Typography variant="caption" color="text.secondary">{label}</Typography>
          </Stack>
        ))}
      </Stack>
    </Box>
  )
}

export function SolutionCard({ question, index, answer }) {
  const isCorrect = answer === question.correctIndex
  const status = answer === undefined ? 'Skipped' : isCorrect ? 'Correct' : 'Incorrect'
  const statusColor = answer === undefined ? 'default' : isCorrect ? 'success' : 'error'

  return (
    <Box sx={{ py: 2, borderTop: '1px solid #edf0f5' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" gap={1.5}>
        <Typography sx={{ fontSize: 14, fontWeight: 700, lineHeight: 1.55 }}>
          <Box component="span" sx={{ mr: 0.75, color: 'text.secondary' }}>{String(index + 1).padStart(2, '0')}.</Box>
          {question.text}
        </Typography>
        <Chip
          label={status}
          size="small"
          color={statusColor}
          sx={{ borderRadius: 0, flexShrink: 0, fontWeight: 800 }}
        />
      </Stack>
      <Stack spacing={0.5} sx={{ mt: 1.25, pl: { xs: 0, sm: 3.5 } }}>
        <Typography variant="body2">
          Correct answer: <Box component="span" sx={{ fontWeight: 800 }}>{question.options[question.correctIndex]}</Box>
        </Typography>
        {answer !== undefined && (
          <Typography variant="body2" color={isCorrect ? 'success.main' : 'error.main'}>
            Your answer: {question.options[answer]}
          </Typography>
        )}
        {question.explanation && (
          <Typography variant="body2" color="text.secondary" sx={{ pt: 0.5, lineHeight: 1.65 }}>
            {question.explanation}
          </Typography>
        )}
      </Stack>
    </Box>
  )
}

