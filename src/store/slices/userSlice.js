import { createSlice } from '@reduxjs/toolkit'

const storedProfile = (() => {
  try {
    return JSON.parse(sessionStorage.getItem('exampro.profile') ?? 'null')
  } catch {
    return null
  }
})()

const userSlice = createSlice({
  name: 'user',
  initialState: {
    profile: storedProfile,
    preferences: {},
  },
  reducers: {
    setProfile(state, action) {
      state.profile = action.payload
      sessionStorage.setItem('exampro.profile', JSON.stringify(action.payload))
    },
  },
})

export const { setProfile } = userSlice.actions
export default userSlice.reducer
