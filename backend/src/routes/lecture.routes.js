import { Router } from 'express'
import { asyncHandler } from '../middleware/asyncHandler.js'
import { authorize } from '../middleware/authorize.js'

export function createLectureRoutes(controller, authenticateMiddleware) {
  const router = Router()
  router.get('/', asyncHandler(controller.list))
  router.get('/:lectureId', asyncHandler(controller.getById))
  router.post('/', authenticateMiddleware.handle, authorize('admin', 'instructor'), asyncHandler(controller.create))
  router.patch('/:lectureId', authenticateMiddleware.handle, authorize('admin', 'instructor'), asyncHandler(controller.update))
  router.delete('/:lectureId', authenticateMiddleware.handle, authorize('admin'), asyncHandler(controller.delete))
  return router
}
