import { axiosClient } from '../api/axiosClient'

let accessToken = null

export function setAccessToken(token) {
  accessToken = token
}

export function getAccessToken() {
  return accessToken
}

axiosClient.interceptors.request.use((request) => {
  if (accessToken) request.headers.Authorization = `Bearer ${accessToken}`
  return request
})

export const authService = {
  async login({ email, password }) {
    try {
      const response = await axiosClient.post('/auth/login', { email, password })
      setAccessToken(response.data.data.accessToken)
      return { ...response.data.data.user, accessToken: response.data.data.accessToken }
    } catch (error) {
      throw new Error(error.response?.data?.error?.message ?? 'Unable to sign in.')
    }
  },

  async register({ name, email, password }) {
    try {
      const response = await axiosClient.post('/auth/register', { name, email, password })
      setAccessToken(response.data.data.accessToken)
      return { ...response.data.data.user, accessToken: response.data.data.accessToken }
    } catch (error) {
      throw new Error(error.response?.data?.error?.message ?? 'Unable to create account.')
    }
  },

  async logout() {
    try {
      await axiosClient.post('/auth/logout')
    } finally {
      setAccessToken(null)
    }
  },

  async refresh() {
    try {
      const response = await axiosClient.post('/auth/refresh')
      setAccessToken(response.data.data.accessToken)
      return { ...response.data.data.user, accessToken: response.data.data.accessToken }
    } catch (error) {
      setAccessToken(null)
      throw new Error(error.response?.data?.error?.message ?? 'Session expired.')
    }
  },
}
