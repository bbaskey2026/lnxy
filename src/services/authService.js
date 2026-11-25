import { api } from '../api/api'
import { API_ENDPOINTS } from '../api/endpoints'
import { setAccessToken } from '../api/axiosClient'

export const authService = {
  async login({ email, password }) {
    const session = await api.post(API_ENDPOINTS.auth.login, { email, password })
    setAccessToken(session.accessToken)
    return { ...session.user, accessToken: session.accessToken }
  },

  async register({ name, email, password }) {
    const session = await api.post(API_ENDPOINTS.auth.register, { name, email, password })
    setAccessToken(session.accessToken)
    return { ...session.user, accessToken: session.accessToken }
  },

  async logout() {
    try {
      await api.post(API_ENDPOINTS.auth.logout)
    } finally {
      setAccessToken(null)
    }
  },

  async refresh() {
    try {
      const session = await api.post(API_ENDPOINTS.auth.refresh)
      setAccessToken(session.accessToken)
      return { ...session.user, accessToken: session.accessToken }
    } catch (error) {
      setAccessToken(null)
      throw error
    }
  },

  async me() {
    return api.get(API_ENDPOINTS.auth.me)
  },
}
