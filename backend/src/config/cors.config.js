import { env } from './env.js'

export function createCorsOptions() {
  return {
    origin(origin, callback) {
      if (!origin || origin === env.FRONTEND_URL) return callback(null, true)
      callback(new Error('Origin is not allowed by CORS'))
    },
    credentials: true,
  }
}
