import { axiosClient } from '../api/axiosClient'

let accessToken = null
let refreshRequest = null

function getErrorMessage(error, fallback) {
  return error.response?.data?.statusDesc
    ?? error.response?.data?.error?.message
    ?? fallback
}

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

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const request = error.config
    const isAuthRequest = /\/auth\/(?:login|dashboard|register|refresh|logout)(?:\?|$)/.test(request?.url ?? '')
    if (error.response?.status !== 401 || !request || request._authRetry || isAuthRequest) {
      return Promise.reject(error)
    }

    request._authRetry = true
    try {
      if (!refreshRequest) {
        refreshRequest = authService.refresh().finally(() => {
          refreshRequest = null
        })
      }
      await refreshRequest
      return axiosClient(request)
    } catch (refreshError) {
      setAccessToken(null)
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('exampro:auth-expired'))
      }
      return Promise.reject(refreshError)
    }
  },
)

export const authService = {
  async login({ email, password }) {
    try {
      const response = await axiosClient.post('/user/auth/dashboard', { email, password })
      setAccessToken(response.data.data.accessToken)
      return { ...response.data.data.user, accessToken: response.data.data.accessToken }
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Unable to sign in.'))
    }
  },

  async register({ name, email, password }) {
    try {
      const response = await axiosClient.post('/auth/register', { name, email, password })
      setAccessToken(response.data.data.accessToken)
      return { ...response.data.data.user, accessToken: response.data.data.accessToken }
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Unable to create account.'))
    }
  },

  async getMe() {
    try {
      const response = await axiosClient.get('/auth/me')
      return response.data.data
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Unable to load your profile.'))
    }
  },

  async logout() {
    try {
      await axiosClient.post('/auth/logout')
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Unable to sign out completely.'))
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
      throw new Error(getErrorMessage(error, 'Session expired.'))
    }
  },
}
