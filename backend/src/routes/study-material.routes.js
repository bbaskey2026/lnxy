import { Router } from 'express'
import { asyncHandler } from '../middleware/asyncHandler.js'
import { authorize } from '../middleware/authorize.js'

export function createStudyMaterialRoutes(controller, authenticateMiddleware) {
  const router = Router()
  router.get('/', asyncHandler(controller.list))
  router.get('/:id', asyncHandler(controller.getById))
  router.post('/', authenticateMiddleware.handle, authorize('admin', 'instructor'), asyncHandler(controller.create))
  router.patch('/:id', authenticateMiddleware.handle, authorize('admin', 'instructor'), asyncHandler(controller.update))
  router.delete('/:id', authenticateMiddleware.handle, authorize('admin'), asyncHandler(controller.delete))
  return router
}
