import { Router } from 'express'
import { asyncHandler } from '../middleware/asyncHandler.js'
import { authorize } from '../middleware/authorize.js'
import { validateRequest } from '../middleware/validateRequest.js'
import { createMockTestValidator, updateMockTestValidator } from '../validators/mock-test.validator.js'

export function createMockTestRoutes(controller, authenticateMiddleware) {
  const router = Router()
  router.get('/', asyncHandler(controller.list))
  router.get('/:id', asyncHandler(controller.getById))
  router.post('/', authenticateMiddleware.handle, authorize('admin', 'instructor'), validateRequest(createMockTestValidator), asyncHandler(controller.create))
  router.patch('/:id', authenticateMiddleware.handle, authorize('admin', 'instructor'), validateRequest(updateMockTestValidator), asyncHandler(controller.update))
  router.delete('/:id', authenticateMiddleware.handle, authorize('admin'), asyncHandler(controller.delete))
  return router
}
