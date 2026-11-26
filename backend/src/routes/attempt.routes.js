import { Router } from 'express'
import { asyncHandler } from '../middleware/asyncHandler.js'
import { validateRequest } from '../middleware/validate.middleware.js'
import { z } from 'zod'

export function createAttemptRoutes(controller, authenticateMiddleware) {
  const router = Router()
  router.use(authenticateMiddleware.handle)
  router.post('/', validateRequest(z.object({ mockTestId: z.string().uuid() })), asyncHandler(controller.start))
  router.patch('/:attemptId/answers', validateRequest(z.object({
    questionId: z.string().uuid(),
    selectedOptionIndex: z.number().int().nonnegative(),
    markedForReview: z.boolean().optional(),
  })), asyncHandler(controller.saveAnswer))
  router.post('/:attemptId/submit', asyncHandler(controller.submit))
  return router
}
