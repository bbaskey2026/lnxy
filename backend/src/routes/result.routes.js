import { Router } from 'express'
import { asyncHandler } from '../middleware/asyncHandler.js'

export function createResultRoutes(controller, authenticateMiddleware) {
  const router = Router()
  router.use(authenticateMiddleware.handle)
  router.get('/', asyncHandler(controller.list))
  router.get('/attempt/:attemptId', asyncHandler(controller.getByAttempt))
  return router
}
