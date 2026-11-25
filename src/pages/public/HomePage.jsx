import { useEffect, useState } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Stack,
  Typography,
} from '@mui/material'
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  ClipboardCheck,
  Clock3,
  GraduationCap,
  Library,
  Medal,
  Users,
  Video,
} from 'lucide-react'
import { examService } from '../../services/examService'
import { mockTestService } from '../../services/mockTestService'
import { platformService } from '../../services/platformService'
import ExamLogo from '../../components/ExamLogo'

const examCategories = [
  { name: 'SSC Exams', exams: '33 Exams', color: '#eef2ff' },
  { name: 'Banking Exams', exams: '81 Exams', color: '#f3f7ff' },
  { name: 'Teaching Exams', exams: '174 Exams', color: '#edf4ff' },
  { name: 'Civil Services', exams: '27 Exams', color: '#f3f3f3' },
  { name: 'Railways Exams', exams: '35 Exams', color: '#eff6ff' },
  { name: 'State Govt. Exams', exams: '691 Exams', color: '#f3f3f3' },
]

const preparationSteps = [
  { icon: BookOpen, title: 'Learn', color: '#4f46e5' },
  { icon: ClipboardCheck, title: 'Practice', color: '#0ea5a4' },
  { icon: BarChart3, title: 'Improve', color: '#0b5cff' },
  { icon: Medal, title: 'Succeed', color: '#16a34a' },
]

export default function HomePage() {
  const navigate = useNavigate()
  const [content, setContent] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    Promise.all([
      examService.list(),
      platformService.listStudyMaterials(),
      mockTestService.list(),
      platformService.listPreviousPapers(),
    ])
      .then(([exams, materials, tests, papers]) => {
        if (!active) return
        setContent({
          exams: exams.filter((exam) => exam.isActive !== false),
          materials: materials.filter((material) => material.isPublished !== false),
          tests,
          papers,
        })
      })
      .catch((requestError) => {
        if (active) setError(requestError.message ?? 'Unable to load examination data.')
      })
    return () => { active = false }
  }, [])

  const popularExams = content?.exams.slice(0, 6) ?? []

  return (
    <Box sx={{ bgcolor: '#fff', minHeight: '100vh', overflow: 'hidden' }}>
      <Box sx={{ borderBottom: '1px solid #edf0f5', background: 'linear-gradient(180deg, #f7faff 0%, #fff 100%)' }}>
        <Container maxWidth="lg" sx={{ py: { xs: 5, md: 7 } }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 0.92fr' }, gap: { xs: 5, md: 6 }, alignItems: 'center' }}>
            <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
              <Typography component="h1" sx={{ fontSize: { xs: 38, sm: 48, md: 58 }, lineHeight: 1.08, letterSpacing: '-.045em', fontWeight: 850, color: '#182033' }}>
                One destination for
                <Box component="span" sx={{ display: 'block', color: 'primary.main' }}>complete exam preparation</Box>
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: { xs: 'center', md: 'flex-start' }, flexWrap: 'wrap', gap: { xs: 2, sm: 3 }, mt: 3, mb: 3.5 }}>
                {preparationSteps.map(({ icon: Icon, title, color }) => (
                  <Stack key={title} direction="row" spacing={0.75} alignItems="center">
                    <Box sx={{ width: 28, height: 28, display: 'grid', placeItems: 'center', bgcolor: `${color}12`, color }}>
                      <Icon size={16} strokeWidth={2.5} />
                    </Box>
                    <Typography fontWeight={800}>{title}</Typography>
                  </Stack>
                ))}
              </Box>
              <Typography sx={{ mb: 3, color: 'text.secondary', fontSize: { xs: 15, md: 17 } }}>
                Start your preparation for selections. For Free!
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} justifyContent={{ xs: 'center', md: 'flex-start' }}>
                <Button component={RouterLink} to="/register" size="large" variant="contained" endIcon={<ArrowRight size={18} />} sx={{ px: 3.5, py: 1.5 }}>
                  Get Started For Free
                </Button>
                <Button component={RouterLink} to="/exams" size="large" variant="outlined" sx={{ px: 3.5, py: 1.5 }}>
                  Explore exams
                </Button>
              </Stack>
              {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
            </Box>

            <Box sx={{ position: 'relative', minHeight: { xs: 330, md: 420 }, display: 'grid', placeItems: 'center' }}>
              <Box sx={{ position: 'absolute', width: { xs: '84%', md: '88%' }, height: { xs: 270, md: 340 }, bgcolor: '#edf4ff', borderRadius: '46% 54% 52% 48%', transform: 'rotate(-4deg)' }} />
              <Card sx={{ position: 'relative', zIndex: 1, width: { xs: '78%', md: '76%' }, p: { xs: 1, md: 2 }, border: '1px solid #dfe7f5', boxShadow: '0 24px 60px rgba(31,45,103,.12)' }}>
                <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Chip label="LIVE PREPARATION" size="small" color="primary" />
                    <Typography variant="caption" color="text.secondary">Today</Typography>
                  </Stack>
                  <Typography variant="h5" sx={{ mt: 2.5, mb: 2.5 }}>A focused path to your goal</Typography>
                  {[
                    ['Study notes', '24 chapters', Library],
                    ['Daily practice', '15 questions', ClipboardCheck],
                    ['Mock test', '120 minutes', Clock3],
                  ].map(([label, detail, Icon]) => (
                    <Stack key={label} direction="row" alignItems="center" spacing={1.5} sx={{ py: 1.25, borderTop: '1px solid #edf0f5' }}>
                      <Box sx={{ width: 38, height: 38, bgcolor: '#f1f4ff', color: 'primary.main', display: 'grid', placeItems: 'center' }}>
                        <Icon size={19} />
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography fontWeight={800} fontSize={14}>{label}</Typography>
                        <Typography variant="caption" color="text.secondary">{detail}</Typography>
                      </Box>
                      <ArrowRight size={16} color="#98a2b3" />
                    </Stack>
                  ))}
                </CardContent>
              </Card>
            </Box>
          </Box>
          <Box sx={{ mt: { xs: 3, md: 5 }, pt: 3, borderTop: '1px solid #edf0f5', display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 2 }}>
            {[
              ['9.2+ Crore', 'Registered Students'],
              ['4+ Lacs', 'Student Selections'],
              ['242+ Crore', 'Tests Attempted'],
              ['5.5+ Crore', 'Classes Attended'],
            ].map(([value, label]) => (
              <Box key={label} sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                <Typography variant="h5" color="primary.main" fontWeight={900}>{value}</Typography>
                <Typography variant="body2" color="text.secondary">{label}</Typography>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 5, md: 7 } }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h4" sx={{ fontSize: { xs: 27, md: 34 } }}>Popular Exams</Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }}>Get exam-ready with concepts, questions and study notes as per the latest pattern</Typography>
        </Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(6, 1fr)' }, gap: 2 }}>
          {examCategories.map(({ name, exams, color }) => (
            <Card component={RouterLink} to="/exams" key={name} sx={{ textDecoration: 'none', color: 'inherit', textAlign: 'center', p: 2, transition: 'transform .18s, box-shadow .18s', '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 14px 30px rgba(31,45,103,.10)' } }}>
              <Box sx={{ width: 64, height: 58, mx: 'auto', mb: 1.5, bgcolor: color, display: 'grid', placeItems: 'center', p: 0.75 }}>
                <ExamLogo name={name} size={48} />
              </Box>
              <Typography variant="body2" fontWeight={850} sx={{ minHeight: 38 }}>{name}</Typography>
              <Typography variant="caption" color="text.secondary">{exams}</Typography>
            </Card>
          ))}
        </Box>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2, textAlign: 'center' }}>
          Organization logos: <a href="https://commons.wikimedia.org/wiki/File:Staff_Selection_Commission_Logo.jpg" target="_blank" rel="noreferrer">SSC</a>
          {' · '}<a href="https://commons.wikimedia.org/wiki/File:IBPS_LOGO.png" target="_blank" rel="noreferrer">IBPS</a>
          {' · '}<a href="https://commons.wikimedia.org/wiki/File:NTA_logo.png" target="_blank" rel="noreferrer">NTA</a>
          {' · '}<a href="https://commons.wikimedia.org/wiki/File:Logo_-_Union_Public_Service_Commission_-_Government_of_India.jpg" target="_blank" rel="noreferrer">UPSC</a>
          {' · '}<a href="https://commons.wikimedia.org/wiki/File:Indian_Railways_(acronym_wordmark).svg" target="_blank" rel="noreferrer">Indian Railways</a>
          {' · '}<a href="/exam-logos/ATTRIBUTION.md">Image credits</a>
        </Typography>
      </Container>

      <Box sx={{ bgcolor: '#f4f7fb', py: { xs: 5, md: 7 } }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '0.75fr 1.25fr' }, gap: 4, alignItems: 'center' }}>
            <Box>
              <Chip label="SUPERCOACHING" color="primary" sx={{ mb: 2 }} />
              <Typography variant="h4" sx={{ fontSize: { xs: 29, md: 38 } }}>Crack any government exam</Typography>
              <Typography color="text.secondary" sx={{ mt: 1.5, mb: 3 }}>Learn with India's expert teachers through live classes, study material and guided practice.</Typography>
              <Button component={RouterLink} to="/exams" variant="contained" endIcon={<ArrowRight size={17} />}>Explore Supercoaching</Button>
            </Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 1.5 }}>
              {[
                [Video, 'Daily Live Classes'],
                [Users, 'Expert Teachers'],
                [Library, 'Complete Study Material'],
                [ClipboardCheck, 'Unlimited Practice'],
              ].map(([Icon, title]) => (
                <Card key={title} sx={{ p: 1.5 }}>
                  <Stack direction="row" spacing={1.25} alignItems="center">
                    <Box sx={{ width: 42, height: 42, bgcolor: 'primary.light', color: 'primary.main', display: 'grid', placeItems: 'center' }}>
                      <Icon size={20} />
                    </Box>
                    <Typography fontWeight={800}>{title}</Typography>
                  </Stack>
                </Card>
              ))}
            </Box>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 5, md: 7 } }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} sx={{ mb: 3 }}>
          <Box>
            <Typography variant="h4" sx={{ fontSize: { xs: 27, md: 34 } }}>Popular Test Series</Typography>
            <Typography color="text.secondary" sx={{ mt: 0.5 }}>Practice with the latest patterns and build a winning strategy</Typography>
          </Box>
          <Button
            component={RouterLink}
            to="/student/mock-tests"
            endIcon={<ArrowRight size={17} />}
            sx={{ mt: { xs: 1.5, sm: 0 }, alignSelf: { xs: 'flex-start', sm: 'center' } }}
          >
            Explore all tests
          </Button>
        </Stack>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, gap: 2 }}>
          {(popularExams.length ? popularExams.slice(0, 3) : [
            { id: '1', name: 'SSC Combined Graduate Level', category: 'SSC', shortName: 'SSC CGL' },
            { id: '2', name: 'Banking PO & Clerk', category: 'Banking', shortName: 'BANK' },
            { id: '3', name: 'Railway Recruitment', category: 'Railways', shortName: 'RRB' },
          ]).map((exam) => (
            <Card key={exam.id} sx={{ height: '100%', transition: 'transform .18s', '&:hover': { transform: 'translateY(-4px)' } }}>
              <CardContent sx={{ p: 2.5 }}>
                <Stack direction="row" spacing={1.5}>
                  <ExamLogo name={exam.name} size={52} />
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="caption" color="text.secondary">{exam.category}</Typography>
                    <Typography fontWeight={850} sx={{ mt: 0.25 }}>{exam.name}</Typography>
                  </Box>
                </Stack>
                <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                  <Chip size="small" label={`${content?.tests.filter((test) => test.examId === exam.id).length ?? 0} Tests`} />
                  <Chip size="small" variant="outlined" label="Latest pattern" />
                </Stack>
                <Button fullWidth variant="outlined" sx={{ mt: 2 }} onClick={() => navigate(exam.id === '1' || exam.id === '2' || exam.id === '3' ? '/exams' : `/exams/${exam.id}`)}>
                  View Test Series
                </Button>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Container>

      <Box sx={{ bgcolor: 'primary.main', color: '#fff' }}>
        <Container maxWidth="lg" sx={{ py: { xs: 5, md: 6 } }}>
          <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ md: 'center' }} spacing={3}>
            <Box>
              <Typography variant="h4" sx={{ fontSize: { xs: 26, md: 34 } }}>Start your learning journey now!</Typography>
              <Typography sx={{ mt: 1, color: '#dfe4ff' }}>Learn. Practice. Improve. Succeed.</Typography>
            </Box>
            <Button component={RouterLink} to="/register" variant="contained" size="large" sx={{ alignSelf: { xs: 'stretch', md: 'center' }, px: 3.5 }}>Get Started</Button>
          </Stack>
        </Container>
      </Box>

      <Box component="footer" sx={{ bgcolor: '#fff', borderTop: '1px solid #edf0f5' }}>
        <Container maxWidth="lg" sx={{ py: 3 }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1.4fr repeat(3, 1fr)' }, gap: { xs: 3, md: 5 }, py: 2 }}>
            <Box>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
                <Box sx={{ width: 38, height: 38, bgcolor: 'primary.main', color: '#fff', display: 'grid', placeItems: 'center', fontWeight: 900 }}>E</Box>
                <Typography variant="h6" color="primary.main">Exam<span style={{ color: '#232323' }}>Pro</span></Typography>
              </Stack>
              <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 280, lineHeight: 1.7 }}>
                Learn, practice and improve with complete preparation resources for competitive exams.
              </Typography>
            </Box>

            {[
              ['Quick Links', [
                ['Exams', '/exams'],
                ['Mock Tests', '/student/mock-tests'],
                ['Study Material', '/student/study-materials'],
                ['Previous Papers', '/student/previous-papers'],
              ]],
              ['Resources', [
                ['Current Affairs', '/student/current-affairs'],
                ['Practice', '/student/practice'],
                ['Bookmarks', '/student/bookmarks'],
                ['Analytics', '/student/analytics'],
              ]],
              ['Company', [
                ['About Us', '/about'],
                ['Contact Us', '/contact'],
                ['Dashboard', '/student/dashboard'],
                ['Student Profile', '/student/profile'],
              ]],
            ].map(([title, links]) => (
              <Box key={title}>
                <Typography fontWeight={850} sx={{ mb: 1.5 }}>{title}</Typography>
                <Stack spacing={0.75}>
                  {links.map(([label, path]) => (
                    <Button
                      key={label}
                      component={RouterLink}
                      to={path}
                      color="inherit"
                      size="small"
                      sx={{ width: 'fit-content', p: 0, minWidth: 0, justifyContent: 'flex-start', color: 'text.secondary', '&:hover': { color: 'primary.main', bgcolor: 'transparent' } }}
                    >
                      {label}
                    </Button>
                  ))}
                </Stack>
              </Box>
            ))}
          </Box>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            justifyContent="space-between"
            alignItems={{ sm: 'center' }}
            spacing={1.5}
            sx={{ borderTop: '1px solid #edf0f5', pt: 2.5 }}
          >
            <Typography variant="body2" color="text.secondary">© 2026 ExamPro. All rights reserved.</Typography>
            <Stack direction="row" spacing={2}>
              <Button component={RouterLink} to="/about" color="inherit" size="small" sx={{ color: 'text.secondary', p: 0, minWidth: 0 }}>Privacy Policy</Button>
              <Button component={RouterLink} to="/about" color="inherit" size="small" sx={{ color: 'text.secondary', p: 0, minWidth: 0 }}>Terms of Use</Button>
              <GraduationCap size={19} color="#98a2b3" />
            </Stack>
          </Stack>
        </Container>
      </Box>
    </Box>
  )
}
