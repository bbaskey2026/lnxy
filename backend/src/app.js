import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { fileURLToPath } from 'node:url'
import pinoHttp from 'pino-http'
import { env } from './config/env.js'
import { createLogger } from './config/logger.js'
import { createCorsOptions } from './config/cors.config.js'
import { appConfig } from './config/app.config.js'
import { createRateLimiter } from './middleware/rateLimit.middleware.js'
import { requestId } from './middleware/requestId.js'
import { errorHandler } from './middleware/error.middleware.js'
import { notFound } from './middleware/notFound.middleware.js'

export function createApp(router, logger = createLogger(env)) {
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
  app.use(requestId)
  app.use(pinoHttp({ logger, genReqId: (req) => req.requestId }))
  app.use(createRateLimiter())
  app.use(cookieParser())
  app.use(express.json({ limit: appConfig.jsonLimit }))
  app.use(express.urlencoded({ extended: false, limit: appConfig.jsonLimit }))
  const previewAssets = express.static(fileURLToPath(new URL('../public/previews/', import.meta.url)), {
    maxAge: env.NODE_ENV === 'production' ? '1d' : 0,
  })
  app.use('/api/v1/assets/previews', previewAssets)
  app.use('/api/assets/previews', previewAssets)
  app.use('/api/v1', router)
  app.use('/api', router)
  app.use(notFound)
  app.use(errorHandler(logger))
  return app
}
