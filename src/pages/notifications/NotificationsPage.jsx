import { useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Box, Button, Chip, Stack, Typography } from '@mui/material'
import { Bell, CheckCheck } from 'lucide-react'
import { markAllRead, markRead } from '../../store/slices/notificationSlice'

export default function NotificationsPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { items, unreadCount } = useSelector((state) => state.notifications)
  const [filter, setFilter] = useState('All')
  const categories = ['All', ...new Set(items.map((item) => item.category))]
  const filtered = useMemo(
    () => filter === 'All' ? items : items.filter((item) => item.category === filter),
    [items, filter],
  )

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 900, mx: 'auto' }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h4">Notifications</Typography>
          <Typography color="text.secondary" sx={{ mt: 0.5 }}>{unreadCount ? `${unreadCount} unread` : 'You are all caught up'}</Typography>
        </Box>
        <Button startIcon={<CheckCheck size={17} />} disabled={!unreadCount} onClick={() => dispatch(markAllRead())} sx={{ mt: { xs: 1.5, sm: 0 } }}>
          Mark all read
        </Button>
      </Stack>
      <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mb: 2 }}>
        {categories.map((category) => (
          <Chip key={category} label={category} clickable color={filter === category ? 'primary' : 'default'} variant={filter === category ? 'filled' : 'outlined'} onClick={() => setFilter(category)} />
        ))}
      </Stack>
      <Box sx={{ bgcolor: 'white', border: '1px solid #e9edf4', borderRadius: 2.5, overflow: 'hidden' }}>
        {filtered.map((item, index) => (
          <Box
            key={item.id}
            sx={{
              p: 2,
              borderTop: index ? '1px solid #edf0f5' : 'none',
              bgcolor: item.read ? 'white' : '#f5f8ff',
              cursor: 'pointer',
              '&:hover': { bgcolor: item.read ? '#fafbfc' : '#edf3ff' },
            }}
            onClick={() => {
              dispatch(markRead(item.id))
              navigate(item.route)
            }}
          >
            <Stack direction="row" spacing={1.5} alignItems="flex-start">
              <Box sx={{ width: 40, height: 40, borderRadius: '50%', bgcolor: item.read ? '#f1f3f7' : '#dde7ff', color: 'primary.main', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                <Bell size={18} />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Stack direction="row" justifyContent="space-between" gap={1}>
                  <Typography variant="body1" fontWeight={800}>{item.title}</Typography>
                  {!item.read && <Box sx={{ width: 8, height: 8, mt: 0.75, borderRadius: '50%', bgcolor: 'primary.main', flexShrink: 0 }} />}
                </Stack>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>{item.detail}</Typography>
                <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                  <Chip label={item.category} size="small" variant="outlined" />
                  <Typography variant="caption" color="text.secondary">
                    {new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(item.createdAt))}
                  </Typography>
                </Stack>
              </Box>
            </Stack>
          </Box>
        ))}
      </Box>
    </Box>
  )
}
