import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { authService } from '../../services/authService'

const storedUser = (() => {
  try {
    return JSON.parse(sessionStorage.getItem('exampro.user') ?? 'null')
  } catch {
    return null
  }
})()

export const login = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    return await authService.login(credentials)
  } catch (error) {
    return rejectWithValue(error.message)
  }
})

export const register = createAsyncThunk('auth/register', async (details, { rejectWithValue }) => {
  try {
    return await authService.register(details)
  } catch (error) {
    return rejectWithValue(error.message)
  }
})

export const restoreSession = createAsyncThunk('auth/restoreSession', async (_, { rejectWithValue }) => {
  try {
    return await authService.refresh()
  } catch (error) {
    return rejectWithValue(error.message)
  }
})

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    currentUser: storedUser,
    status: 'loading',
    role: storedUser?.role ?? null,
    error: null,
  },
  reducers: {
    setAuthenticatedUser(state, action) {
      const { accessToken: _accessToken, ...safeUser } = action.payload
      state.currentUser = safeUser
      state.role = safeUser?.role ?? null
      state.status = 'authenticated'
      state.error = null
      sessionStorage.setItem('exampro.user', JSON.stringify(safeUser))
    },
    logout(state) {
      state.currentUser = null
      state.role = null
      state.status = 'idle'
      state.error = null
      sessionStorage.removeItem('exampro.user')
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(restoreSession.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(restoreSession.fulfilled, (state, action) => {
        const { accessToken: _accessToken, ...safeUser } = action.payload
        state.currentUser = safeUser
        state.role = safeUser.role
        state.status = 'authenticated'
        state.error = null
        sessionStorage.setItem('exampro.user', JSON.stringify(safeUser))
      })
      .addCase(restoreSession.rejected, (state) => {
        state.currentUser = null
        state.role = null
        state.status = 'idle'
        sessionStorage.removeItem('exampro.user')
      })
      .addCase(login.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        const { accessToken: _accessToken, ...safeUser } = action.payload
        state.currentUser = safeUser
        state.role = safeUser.role
        state.status = 'authenticated'
        state.error = null
        sessionStorage.setItem('exampro.user', JSON.stringify(safeUser))
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'idle'
        state.error = action.payload
      })
      .addCase(register.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(register.fulfilled, (state, action) => {
        const { accessToken: _accessToken, ...safeUser } = action.payload
        state.currentUser = safeUser
        state.role = safeUser.role
        state.status = 'authenticated'
        state.error = null
        sessionStorage.setItem('exampro.user', JSON.stringify(safeUser))
      })
      .addCase(register.rejected, (state, action) => {
        state.status = 'idle'
        state.error = action.payload
      })
  },
})

export const { setAuthenticatedUser, logout } = authSlice.actions
export default authSlice.reducer
