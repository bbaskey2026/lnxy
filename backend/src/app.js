import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { fileURLToPath } from 'node:url'
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
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        imgSrc: ["'self'", 'data:', new URL(env.APP_URL).origin],
      },
    },
  }))
  app.use(cors(createCorsOptions()))
  app.use(createRateLimiter())
  app.use(cookieParser())
  app.use(express.json({ limit: appConfig.jsonLimit }))
  app.use(express.urlencoded({ extended: false, limit: appConfig.jsonLimit }))
  app.use(requestId)
  app.use(pinoHttp({ logger, genReqId: (req) => req.requestId }))
  app.use(
    '/api/assets/previews',
    express.static(fileURLToPath(new URL('../public/previews/', import.meta.url)), {
      maxAge: env.NODE_ENV === 'production' ? '1d' : 0,
    }),
  )
  app.use('/api', router)
  app.use(notFound)
  app.use(errorHandler(logger))
  return app
}
