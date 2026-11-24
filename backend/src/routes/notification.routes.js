import { Router } from 'express'
import { asyncHandler } from '../middleware/asyncHandler.js'

export function createNotificationRoutes(controller, authenticateMiddleware) {
  const router = Router()
  router.use(authenticateMiddleware.handle)
  router.get('/', asyncHandler(controller.list))
  router.patch('/:notificationId/read', asyncHandler(controller.markRead))
  return router
}
