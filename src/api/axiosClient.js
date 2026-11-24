import axios from 'axios'
import { config } from '../config'

export const axiosClient = axios.create({
  baseURL: config.apiBaseUrl,
  timeout: 15000,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

axiosClient.interceptors.request.use((request) => request)
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error),
)
