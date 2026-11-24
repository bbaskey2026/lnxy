import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import pinoHttp from 'pino-http'
import pino from 'pino'
import { env } from './config/env.config.js'
import { createCorsOptions } from './config/cors.config.js'
import { appConfig } from './config/app.config.js'
import { createRateLimiter } from './middleware/rateLimiter.js'
import { requestId } from './middleware/requestId.js'
import { errorHandler } from './middleware/errorHandler.js'
import { notFound } from './middleware/notFound.js'

export function createApp(router, logger = pino({ level: env.NODE_ENV === 'development' ? 'debug' : 'info' })) {
  const app = express()
  app.disable('x-powered-by')
  app.use(helmet())
  app.use(cors(createCorsOptions()))
  app.use(createRateLimiter())
  app.use(cookieParser())
  app.use(express.json({ limit: appConfig.jsonLimit }))
  app.use(express.urlencoded({ extended: false, limit: appConfig.jsonLimit }))
  app.use(requestId)
  app.use(pinoHttp({ logger, genReqId: (req) => req.requestId }))
  app.use('/api', router)
  app.use(notFound)
  app.use(errorHandler(logger))
  return app
}
