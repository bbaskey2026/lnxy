import { Router } from 'express'
import { asyncHandler } from '../middleware/asyncHandler.js'
import { validateRequest } from '../middleware/validateRequest.js'
import { z } from 'zod'

export function createBookmarkRoutes(controller, authenticateMiddleware) {
  const router = Router()
  router.use(authenticateMiddleware.handle)
  router.get('/', asyncHandler(controller.list))
  router.post('/toggle', validateRequest(z.object({
    entityType: z.string().min(1),
    entityId: z.string().min(1),
    title: z.string().optional(),
  })), asyncHandler(controller.toggle))
  return router
}
