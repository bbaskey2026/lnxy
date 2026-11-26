import { useEffect, useState } from 'react'
import { Link as RouterLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Breadcrumbs,
  Button,
  Stack ,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Link,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import {
  Bell,
  BookOpen,
  ChevronLeft,
  ClipboardCheck,
  LayoutDashboard,
  Library,
  Menu,
  NotebookPen,
  Search,
  TrendingUp,
  LogOut,
  GraduationCap,
  Bookmark,
  StickyNote,
  Newspaper,
  ChartNoAxesCombined,
  House,
} from 'lucide-react'
import { logout } from '../store/slices/authSlice'
import { fetchNotifications } from '../store/slices/notificationSlice'
import { authService } from '../services/authService'
import ConfirmationDialog from '../components/ConfirmationDialog'
import { useAppFeedback } from '../hooks/useAppFeedback'

const drawerWidth = 248

const navigation = [
  { label: 'Home', path: '/', icon: House },
  { label: 'Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
  { label: 'Examinations', path: '/exams', icon: GraduationCap },
  { label: 'My Courses', path: '/student/courses', icon: BookOpen },
  { label: 'Study Materials', path: '/student/study-materials', icon: Library },
  { label: 'Mock Tests', path: '/student/mock-tests', icon: ClipboardCheck },
  { label: 'Practice', path: '/student/practice', icon: TrendingUp },
  { label: 'Current Affairs', path: '/student/current-affairs', icon: NotebookPen },
  { label: 'Previous Papers', path: '/student/previous-papers', icon: Newspaper },
  { label: 'Bookmarks', path: '/student/bookmarks', icon: Bookmark },
  { label: 'Personal Notes', path: '/student/notes', icon: StickyNote },
  { label: 'Analytics', path: '/student/analytics', icon: ChartNoAxesCombined },
]

export default function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false)
  const dispatch = useDispatch()
  const { showToast } = useAppFeedback()
  const currentUser = useSelector((state) => state.auth.currentUser)
  const currentUserId = currentUser?.id
  const notificationState = useSelector((state) => state.notifications)
  const unreadCount = notificationState.items.filter((item) => !item.read).length
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const navigate = useNavigate()
  const location = useLocation()
  const width = collapsed && !isMobile ? 88 : drawerWidth
  const pageLabel = navigation.find((item) => location.pathname === item.path)?.label
    ?? (location.pathname.startsWith('/exams') ? 'Examinations'
      : location.pathname.includes('/lectures/') ? 'Lecture player'
        : location.pathname.includes('/mock-tests/') ? 'Test interface'
          : 'Student area')

  useEffect(() => {
    if (currentUserId) dispatch(fetchNotifications())
  }, [dispatch, currentUserId])
  const initials = currentUser?.name
    ?.split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() ?? 'AR'

  const confirmLogout = async () => {
    try {
      await authService.logout()
    } catch (error) {
      showToast(error.message, 'error')
    } finally {
      dispatch(logout())
      setLogoutDialogOpen(false)
      navigate('/login', { replace: true })
    }
  }

  const isPublicArea = ['/', '/exams', '/about', '/contact'].includes(location.pathname)
    || location.pathname.startsWith('/exams/')

  if (isPublicArea) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: '#fff' }}>
        <AppBar
          position="sticky"
          color="inherit"
          elevation={0}
          sx={{ borderBottom: '1px solid #e9edf4', bgcolor: 'rgba(255,255,255,.96)' }}
        >
          <Toolbar sx={{ minHeight: '72px !important', maxWidth: 1180, width: '100%', mx: 'auto', px: { xs: 2, md: 3 }, gap: 1.5 }}>
            <Box
              component={RouterLink}
              to="/"
              sx={{ display: 'flex', alignItems: 'center', gap: 1, mr: { xs: 0, md: 3 }, textDecoration: 'none', color: 'inherit' }}
            >
              <Box sx={{ width: 38, height: 38, bgcolor: 'primary.main', color: '#fff', display: 'grid', placeItems: 'center', fontWeight: 900 }}>
                E
              </Box>
              <Typography variant="h6" color="primary.main" sx={{ display: { xs: 'none', sm: 'block' } }}>
                Exam<span style={{ color: '#232323' }}>Pro</span>
              </Typography>
            </Box>
            <Stack direction="row" spacing={0.5} sx={{ flex: 1, display: { xs: 'none', md: 'flex' } }}>
              {[
                ['Exams', '/exams'],
                ['Test Series', '/student/mock-tests'],
                ['Study Material', '/student/study-materials'],
                ['Current Affairs', '/student/current-affairs'],
              ].map(([label, path]) => (
                <Button key={label} component={RouterLink} to={path} color="inherit" sx={{ color: 'text.secondary', px: 1.25 }}>
                  {label}
                </Button>
              ))}
            </Stack>
            {currentUser ? (
              <Button component={RouterLink} to="/student/dashboard" variant="contained" size="small">Dashboard</Button>
            ) : (
              <>
                <Button component={RouterLink} to="/login" variant="outlined" size="small" sx={{ display: { xs: 'none', sm: 'inline-flex' } }}>Log in</Button>
                <Button component={RouterLink} to="/register" variant="contained" size="small">Sign up</Button>
              </>
            )}
          </Toolbar>
        </AppBar>
        <Outlet />
      </Box>
    )
  }

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Toolbar sx={{ px: collapsed && !isMobile ? 2 : 3, justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: 0,
              bgcolor: 'primary.main',
              display: 'grid',
              placeItems: 'center',
              color: 'white',
              fontWeight: 900,
            }}
          >
            E
          </Box>
          {(!collapsed || isMobile) && (
            <Typography variant="h6" sx={{ color: '#232323', lineHeight: 1 }}>
            Exam<span style={{ color: '#0b5cff' }}>Pro</span>
            </Typography>
          )}
        </Box>
        {!isMobile && (
          <IconButton size="small" onClick={() => setCollapsed((value) => !value)} aria-label="Collapse sidebar">
            <ChevronLeft size={18} style={{ transform: collapsed ? 'rotate(180deg)' : undefined }} />
          </IconButton>
        )}
      </Toolbar>
      <Divider />
      <List sx={{ px: 1.25, py: 2 }}>
        {navigation.map(({ label, path, icon: Icon }) => {
          const selected = location.pathname === path
          return (
            <ListItemButton
              key={path}
              selected={selected}
              onClick={() => {
                navigate(path)
                if (isMobile) setMobileOpen(false)
              }}
              sx={{
                mb: 0.5,
                minHeight: 48,
                justifyContent: collapsed && !isMobile ? 'center' : 'flex-start',
                borderRadius: 2,
                '&.Mui-selected': {
                  bgcolor: 'primary.light',
                  color: 'primary.main',
                  '&:hover': { bgcolor: 'primary.light' },
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: collapsed && !isMobile ? 0 : 42, color: 'inherit' }}>
                <Icon size={20} strokeWidth={2} />
              </ListItemIcon>
              {(!collapsed || isMobile) && <ListItemText primary={label} primaryTypographyProps={{ fontSize: 13, fontWeight: 700 }} />}
            </ListItemButton>
          )
        })}
      </List>
      <Box sx={{ mt: 'auto', p: 2 }}>
        {(!collapsed || isMobile) && (
          <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: '#f4f7ff' }}>
            <Typography variant="caption" color="text.secondary">NEED HELP?</Typography>
            <Typography variant="body2" fontWeight={800} sx={{ mt: 0.5 }}>Visit Help Center</Typography>
          </Box>
        )}
      </Box>
    </Box>
  )

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar
        position="fixed"
        color="inherit"
        elevation={0}
        sx={{ zIndex: theme.zIndex.drawer + 1, borderBottom: '1px solid #e9edf4', ml: { md: `${width}px` }, width: { md: `calc(100% - ${width}px)` } }}
      >
        <Toolbar sx={{ minHeight: '72px !important', gap: 1 }}>
          {isMobile && (
            <IconButton onClick={() => setMobileOpen(true)} aria-label="Open navigation">
              <Menu size={22} />
            </IconButton>
          )}
          <Box sx={{ flex: 1 }}>
            <Breadcrumbs aria-label="Breadcrumb" sx={{ '& li': { fontSize: 12 } }}>
              <Link
                component="button"
                underline="hover"
                color="text.secondary"
                onClick={() => navigate(currentUser ? '/student/dashboard' : '/')}
              >
                {currentUser ? 'Student' : 'TestBooks'}
              </Link>
              <Typography variant="body2" color="text.primary" fontWeight={700}>{pageLabel}</Typography>
            </Breadcrumbs>
          </Box>
          {currentUser ? (
            <>
              <IconButton aria-label="Search resources" onClick={() => navigate('/student/study-materials')}><Search size={20} /></IconButton>
              <IconButton aria-label="Notifications" onClick={() => navigate('/student/notifications')}>
                <Badge badgeContent={unreadCount} color="error" invisible={!unreadCount}><Bell size={20} /></Badge>
              </IconButton>
              <IconButton
                aria-label="Open profile"
                onClick={() => navigate('/student/profile')}
                sx={{ p: 0 }}
              >
                <Avatar sx={{ width: 38, height: 38, bgcolor: '#dfe5ff', color: 'primary.main', fontWeight: 800 }}>
                  {initials}
                </Avatar>
              </IconButton>
              <IconButton
                aria-label="Sign out"
                onClick={() => setLogoutDialogOpen(true)}
              >
                <LogOut size={19} />
              </IconButton>
            </>
          ) : (
            <>
              <Button onClick={() => navigate('/login')} variant="outlined" size="small">Log in</Button>
              <Button onClick={() => navigate('/register')} variant="contained" size="small">Sign up</Button>
            </>
          )}
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { md: width }, flexShrink: { md: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{ display: { xs: 'block', md: 'none' }, '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' } }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          open
          sx={{ display: { xs: 'none', md: 'block' }, '& .MuiDrawer-paper': { width, boxSizing: 'border-box', borderRight: '1px solid #e9edf4', transition: 'width .2s' } }}
        >
          {drawer}
        </Drawer>
      </Box>

      <Box component="main" sx={{ flexGrow: 1, width: { md: `calc(100% - ${width}px)` } }}>
        <Toolbar sx={{ minHeight: '72px !important' }} />
        <Outlet />
      </Box>

      <ConfirmationDialog
        open={logoutDialogOpen}
        title="Sign out?"
        description={<Typography color="text.secondary">You'll need to sign in again to continue your preparation.</Typography>}
        cancelLabel="Stay signed in"
        confirmLabel="Sign out"
        confirmColor="error"
        onCancel={() => setLogoutDialogOpen(false)}
        onConfirm={confirmLogout}
      />
    </Box>
  )
}
