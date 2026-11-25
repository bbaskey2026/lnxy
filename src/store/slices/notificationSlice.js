import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { platformService } from '../../services/platformService'

export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async () => (await platformService.listNotifications()).map((item) => ({
    ...item,
    read: item.isRead ?? item.read ?? false,
  })),
)

export const markRead = createAsyncThunk(
  'notifications/markRead',
  (notificationId) => platformService.markNotificationRead(notificationId),
)

export const markAllRead = createAsyncThunk(
  'notifications/markAllRead',
  async (_, { getState }) => {
    const unreadItems = getState().notifications.items.filter((item) => !item.read)
    await Promise.all(unreadItems.map((item) => platformService.markNotificationRead(item.id)))
  },
)

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      .addCase(markRead.fulfilled, (state, action) => {
        const notification = state.items.find((item) => item.id === action.meta.arg)
        if (notification) notification.read = true
      })
      .addCase(markRead.rejected, (state, action) => {
        state.error = action.error.message
      })
      .addCase(markAllRead.fulfilled, (state) => {
        state.items.forEach((item) => {
          item.read = true
        })
      })
      .addCase(markAllRead.rejected, (state, action) => {
        state.error = action.error.message
      })
  },
})

export default notificationSlice.reducer
