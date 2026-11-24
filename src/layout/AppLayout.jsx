import { useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Breadcrumbs,
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
} from 'lucide-react'
import { logout } from '../store/slices/authSlice'
import { authService } from '../services/authService'

const drawerWidth = 248

const navigation = [
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
  const dispatch = useDispatch()
  const currentUser = useSelector((state) => state.auth.currentUser)
  const notificationState = useSelector((state) => state.notifications)
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
  const initials = currentUser?.name
    ?.split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() ?? 'AR'

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Toolbar sx={{ px: collapsed && !isMobile ? 2 : 3, justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: '11px',
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
            <Typography variant="h6" sx={{ color: 'primary.main', lineHeight: 1 }}>
              Exam<span style={{ color: '#3b82f6' }}>Pro</span>
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
              {(!collapsed || isMobile) && <ListItemText primary={label} primaryTypographyProps={{ fontSize: 14, fontWeight: 700 }} />}
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
            <Breadcrumbs aria-label="Breadcrumb" sx={{ '& li': { fontSize: 13 } }}>
              <Link
                component="button"
                underline="hover"
                color="text.secondary"
                onClick={() => navigate('/student/dashboard')}
              >
                Student
              </Link>
              <Typography variant="body2" color="text.primary" fontWeight={700}>{pageLabel}</Typography>
            </Breadcrumbs>
          </Box>
          <IconButton aria-label="Search resources" onClick={() => navigate('/student/study-materials')}><Search size={20} /></IconButton>
          <IconButton aria-label="Notifications" onClick={() => navigate('/student/notifications')}>
            <Badge badgeContent={notificationState.unreadCount} color="error" invisible={!notificationState.unreadCount}><Bell size={20} /></Badge>
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
            onClick={() => {
              authService.logout()
              dispatch(logout())
              navigate('/login', { replace: true })
            }}
          >
            <LogOut size={19} />
          </IconButton>
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
    </Box>
  )
}
