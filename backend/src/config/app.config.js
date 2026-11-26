import { env } from './env.js'

export const appConfig = Object.freeze({
  name: 'ExamPro API',
  version: '1.0.0',
  port: env.PORT,
  frontendUrl: env.FRONTEND_URL,
  jsonLimit: '1mb',
})
