import { Router } from 'express'
import { asyncHandler } from '../middleware/asyncHandler.js'

export function createAnalyticsRoutes(controller, authenticateMiddleware) {
  const router = Router()
  router.get('/me', authenticateMiddleware.handle, asyncHandler(controller.getMe))
  return router
}
