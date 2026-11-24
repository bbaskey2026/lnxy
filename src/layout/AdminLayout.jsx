import { useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import {
  AppBar,
  Avatar,
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import {
  BarChart3,
  BookOpen,
  ChevronLeft,
  GraduationCap,
  Library,
  LogOut,
  Menu,
  ShieldCheck,
  Users,
} from 'lucide-react'
import { logout } from '../store/slices/authSlice'

const drawerWidth = 248
const navigation = [
  { label: 'Overview', path: '/admin/dashboard', icon: BarChart3 },
  { label: 'Examinations', path: '/admin/exams', icon: GraduationCap },
  { label: 'Courses', path: '/admin/courses', icon: BookOpen },
  { label: 'Materials', path: '/admin/materials', icon: Library },
  { label: 'Users', path: '/admin/users', icon: Users },
  { label: 'Reports', path: '/admin/reports', icon: ShieldCheck },
]

export default function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const width = collapsed && !isMobile ? 88 : drawerWidth

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Toolbar sx={{ px: collapsed && !isMobile ? 2 : 3 }}>
        <Avatar variant="rounded" sx={{ width: 38, height: 38, bgcolor: 'primary.main', mr: 1.25 }}>E</Avatar>
        {(!collapsed || isMobile) && <Typography variant="h6" color="primary">ExamPro <Typography component="span" variant="caption" color="text.secondary">Admin</Typography></Typography>}
        {!isMobile && <IconButton size="small" sx={{ ml: 'auto' }} onClick={() => setCollapsed((value) => !value)}><ChevronLeft size={18} style={{ transform: collapsed ? 'rotate(180deg)' : undefined }} /></IconButton>}
      </Toolbar>
      <Divider />
      <List sx={{ px: 1.25, py: 2 }}>
        {navigation.map(({ label, path, icon: Icon }) => (
          <ListItemButton
            key={path}
            selected={location.pathname === path}
            onClick={() => {
              navigate(path)
              if (isMobile) setMobileOpen(false)
            }}
            sx={{ mb: 0.5, minHeight: 48, borderRadius: 2, justifyContent: collapsed && !isMobile ? 'center' : 'flex-start', '&.Mui-selected': { bgcolor: 'primary.light', color: 'primary.main' } }}
          >
            <ListItemIcon sx={{ minWidth: collapsed && !isMobile ? 0 : 42, color: 'inherit' }}><Icon size={20} /></ListItemIcon>
            {(!collapsed || isMobile) && <ListItemText primary={label} primaryTypographyProps={{ fontSize: 14, fontWeight: 700 }} />}
          </ListItemButton>
        ))}
      </List>
      <Box sx={{ mt: 'auto', p: 2 }}>
        <IconButton onClick={() => {
          dispatch(logout())
          navigate('/login', { replace: true })
        }} aria-label="Sign out"><LogOut size={19} /></IconButton>
      </Box>
    </Box>
  )

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="fixed" color="inherit" elevation={0} sx={{ zIndex: theme.zIndex.drawer + 1, borderBottom: '1px solid #e9edf4', ml: { md: `${width}px` }, width: { md: `calc(100% - ${width}px)` } }}>
        <Toolbar sx={{ minHeight: '72px !important' }}>
          {isMobile && <IconButton onClick={() => setMobileOpen(true)} sx={{ mr: 1 }}><Menu size={20} /></IconButton>}
          <Typography variant="body2" color="text.secondary">Administration / {navigation.find((item) => item.path === location.pathname)?.label ?? 'Overview'}</Typography>
        </Toolbar>
      </AppBar>
      <Box component="nav" sx={{ width: { md: width }, flexShrink: { md: 0 } }}>
        <Drawer variant="temporary" open={mobileOpen} onClose={() => setMobileOpen(false)} sx={{ display: { xs: 'block', md: 'none' }, '& .MuiDrawer-paper': { width: drawerWidth } }}>{drawer}</Drawer>
        <Drawer variant="permanent" open sx={{ display: { xs: 'none', md: 'block' }, '& .MuiDrawer-paper': { width, borderRight: '1px solid #e9edf4', transition: 'width .2s' } }}>{drawer}</Drawer>
      </Box>
      <Box component="main" sx={{ flexGrow: 1, width: { md: `calc(100% - ${width}px)` } }}>
        <Toolbar sx={{ minHeight: '72px !important' }} />
        <Outlet />
      </Box>
    </Box>
  )
}
