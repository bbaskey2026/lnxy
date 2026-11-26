import { Router } from 'express'
import { asyncHandler } from '../middleware/asyncHandler.js'
import { validateRequest } from '../middleware/validate.middleware.js'
import { z } from 'zod'

export function createNoteRoutes(controller, authenticateMiddleware) {
  const router = Router()
  router.use(authenticateMiddleware.handle)
  router.get('/', asyncHandler(controller.list))
  router.post('/', validateRequest(z.object({
    subject: z.string().optional(),
    title: z.string().trim().min(1).max(200),
    content: z.string().trim().min(1).max(10000),
    entityType: z.string().nullable().optional(),
    entityId: z.string().nullable().optional(),
  })), asyncHandler(controller.create))
  router.patch('/:noteId', validateRequest(z.object({
    subject: z.string().optional(),
    title: z.string().trim().min(1).max(200).optional(),
    content: z.string().trim().min(1).max(10000).optional(),
  }).partial()), asyncHandler(controller.update))
  router.delete('/:noteId', asyncHandler(controller.delete))
  return router
}
