import { useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  Alert,
  Box,
  Button,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Radio,
  Select,
  Stack,
  Tab,
  Tabs,
  Typography,
} from '@mui/material'
import { CheckCircle2, ChevronLeft, ChevronRight, XCircle } from 'lucide-react'
import { answerPractice, setPracticeIndex, setPracticeMode } from '../../store/slices/practiceSlice'

export default function PracticePage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const practice = useSelector((state) => state.practice)
  const [examination, setExamination] = useState('All')
  const [subject, setSubject] = useState('All')
  const [difficulty, setDifficulty] = useState('All')
  const [type, setType] = useState('All')

  const filtered = useMemo(() => practice.questions.filter((question) =>
    (examination === 'All' || question.examination === examination)
    && (subject === 'All' || question.subject === subject)
    && (difficulty === 'All' || question.difficulty === difficulty)
    && (type === 'All' || question.type === type),
  ), [practice.questions, examination, subject, difficulty, type])

  const safeIndex = filtered.length ? Math.min(practice.activeIndex, filtered.length - 1) : 0
  const question = filtered[safeIndex]
  const selected = question ? practice.answers[question.id] : undefined
  const historyCorrect = practice.history.filter((item) => item.correct).length
  const accuracy = practice.history.length
    ? Math.round((historyCorrect / practice.history.length) * 100)
    : 0

  const resetFilters = () => {
    setExamination('All')
    setSubject('All')
    setDifficulty('All')
    setType('All')
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1120, mx: 'auto' }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" sx={{ mb: 2 }}>
        <Box>
          <Typography variant="h4">Practice Questions</Typography>
          <Typography color="text.secondary" sx={{ mt: 0.5 }}>Strengthen weak areas with focused sessions.</Typography>
        </Box>
        <Stack direction="row" spacing={1} sx={{ mt: { xs: 2, sm: 0 } }}>
          <Button variant="outlined" onClick={() => navigate('/student/previous-papers')}>Previous papers</Button>
        </Stack>
      </Stack>

      <Tabs
        value={practice.mode}
        onChange={(_, value) => dispatch(setPracticeMode(value))}
        sx={{ mb: 2 }}
      >
        <Tab value="instant" label="Instant explanation" />
        <Tab value="end" label="Explanation after session" />
      </Tabs>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 1.5, mb: 2 }}>
        {[
          ['examination', 'Examination', ['All', ...new Set(practice.questions.map((item) => item.examination))], examination],
          ['subject', 'Subject', ['All', ...new Set(practice.questions.map((item) => item.subject))], subject],
          ['difficulty', 'Difficulty', ['All', 'Easy', 'Medium', 'Hard'], difficulty],
          ['type', 'Question type', ['All', 'MCQ', 'True/False'], type],
        ].map(([key, label, values, value]) => (
          <FormControl key={key} size="small">
            <InputLabel>{label}</InputLabel>
            <Select
              label={label}
              value={value}
              onChange={(event) => {
                dispatch(setPracticeIndex(0))
                if (key === 'examination') setExamination(event.target.value)
                if (key === 'subject') setSubject(event.target.value)
                if (key === 'difficulty') setDifficulty(event.target.value)
                if (key === 'type') setType(event.target.value)
              }}
            >
              {values.map((item) => <MenuItem key={item} value={item}>{item === 'All' ? `All ${label.toLower}` : item}</MenuItem>)}
            </Select>
          </FormControl>
        ))}
      </Box>

      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <Chip label={`${filtered.length} questions`} />
        <Chip label={`${practice.history.length} practiced`} />
        <Chip label={`${accuracy}% accuracy`} color={accuracy >= 70 ? 'success' : 'default'} />
        {(examination !== 'All' || subject !== 'All' || difficulty !== 'All' || type !== 'All') && (
          <Button size="small" onClick={resetFilters}>Clear filters</Button>
        )}
      </Stack>

      {!question ? (
        <Box sx={{ p: 5, textAlign: 'center', bgcolor: 'white', border: '1px solid #e9edf4', borderRadius: 2.5 }}>
          <Typography fontWeight={800}>No matching questions</Typography>
        </Box>
      ) : (
        <Box sx={{ bgcolor: 'white', border: '1px solid #e9edf4', borderRadius: 2.5, p: { xs: 2, md: 3 } }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Typography fontWeight={800}>Question {safeIndex + 1} of {filtered.length}</Typography>
            <Stack direction="row" spacing={1}>
              <Chip label={question.difficulty} size="small" />
              {question.previousYear && <Chip label="Previous year" size="small" variant="outlined" />}
            </Stack>
          </Stack>
          <Typography variant="h6" sx={{ mb: 3, lineHeight: 1.5 }}>{question.text}</Typography>
          <Box sx={{ display: 'grid', gap: 1.25 }}>
            {question.options.map((option, index) => {
              const showResult = practice.mode === 'instant' && selected !== undefined
              const correct = selected !== undefined && index === question.correctIndex
              const incorrect = selected === index && index !== question.correctIndex
              return (
                <Box
                  key={option}
                  onClick={() => dispatch(answerPractice({ questionId: question.id, optionIndex: index }))}
                  sx={{
                    p: 1.25,
                    border: '1px solid',
                    borderColor: correct ? 'success.main' : incorrect ? 'error.main' : selected === index ? 'primary.main' : '#e9edf4',
                    bgcolor: correct ? '#effaf3' : incorrect ? '#fff1f1' : selected === index ? 'primary.light' : 'white',
                    borderRadius: 2,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <Radio checked={selected === index} readOnly sx={{ p: 0.5, mr: 1 }} />
                  <Typography sx={{ flex: 1 }}>{option}</Typography>
                  {showResult && correct && <CheckCircle2 size={18} color="#16a34a" />}
                  {showResult && incorrect && <XCircle size={18} color="#dc2626" />}
                </Box>
              )
            })}
          </Box>
          {selected !== undefined && (
            practice.mode === 'instant'
              ? (
                <Alert
                  severity={selected === question.correctIndex ? 'success' : 'error'}
                  sx={{ mt: 2 }}
                >
                  {question.explanation}
                </Alert>
              )
              : (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  Answer recorded. Explanation will appear after the practice session.
                </Typography>
              )
          )}
          <Stack direction="row" justifyContent="space-between" sx={{ mt: 3 }}>
            <Button
              startIcon={<ChevronLeft size={16} />}
              disabled={safeIndex === 0}
              onClick={() => dispatch(setPracticeIndex(safeIndex - 1))}
            >
              Previous
            </Button>
            <Button
              endIcon={<ChevronRight size={16} />}
              disabled={safeIndex === filtered.length - 1}
              onClick={() => dispatch(setPracticeIndex(safeIndex + 1))}
            >
              Next
            </Button>
          </Stack>
        </Box>
      )}
    </Box>
  )
}
