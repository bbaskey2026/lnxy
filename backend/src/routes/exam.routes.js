import { Router } from 'express'
import { asyncHandler } from '../middleware/asyncHandler.js'
import { authorize } from '../middleware/authorize.js'
import { validateRequest } from '../middleware/validateRequest.js'
import { createExamValidator, updateExamValidator } from '../validators/exam.validator.js'

export function createExamRoutes(examController, authenticateMiddleware) {
  const router = Router()
  router.get('/', asyncHandler(examController.list))
  router.get('/:examId', asyncHandler(examController.getById))
  router.post('/', authenticateMiddleware.handle, authorize('admin', 'instructor'), validateRequest(createExamValidator), asyncHandler(examController.create))
  router.patch('/:examId', authenticateMiddleware.handle, authorize('admin', 'instructor'), validateRequest(updateExamValidator), asyncHandler(examController.update))
  router.delete('/:examId', authenticateMiddleware.handle, authorize('admin'), asyncHandler(examController.delete))
  return router
}
