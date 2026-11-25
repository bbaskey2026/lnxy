import axios from 'axios'
import { config } from '../config'
import { API_ENDPOINTS } from './endpoints'

let accessToken = null

export function setAccessToken(token) {
  accessToken = token
}

export function getAccessToken() {
  return accessToken
}

export const axiosClient = axios.create({
  baseURL: config.apiBaseUrl,
  timeout: 15000,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

axiosClient.interceptors.request.use((request) => {
  if (accessToken) request.headers.Authorization = `Bearer ${accessToken}`
  return request
})

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status
    const message = error.response?.data?.error?.message
      ?? error.response?.data?.message
      ?? error.message
      ?? 'Request failed.'

    if (status === 401 && !error.config?.skipAuthRefresh && error.config?.url !== API_ENDPOINTS.auth.refresh) {
      try {
        const refreshResponse = await axiosClient.post(API_ENDPOINTS.auth.refresh, undefined, { skipAuthRefresh: true })
        setAccessToken(refreshResponse.data?.data?.accessToken ?? null)
        if (accessToken) {
          error.config.headers = {
            ...error.config.headers,
            Authorization: `Bearer ${accessToken}`,
          }
          return axiosClient(error.config)
        }
      } catch {
        setAccessToken(null)
      }
    }

    const apiError = new Error(message)
    apiError.status = status
    apiError.code = error.response?.data?.error?.code
    apiError.response = error.response
    apiError.originalError = error
    return Promise.reject(apiError)
  },
)
