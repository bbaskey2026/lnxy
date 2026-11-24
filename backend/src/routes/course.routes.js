import { Router } from 'express'
import { asyncHandler } from '../middleware/asyncHandler.js'
import { authorize } from '../middleware/authorize.js'
import { validateRequest } from '../middleware/validateRequest.js'
import { createCourseValidator, updateCourseValidator } from '../validators/course.validator.js'

export function createCourseRoutes(controller, authenticateMiddleware) {
  const router = Router()
  router.get('/', asyncHandler(controller.list))
  router.get('/:courseId', asyncHandler(controller.getById))
  router.post('/', authenticateMiddleware.handle, authorize('admin', 'instructor'), validateRequest(createCourseValidator), asyncHandler(controller.create))
  router.patch('/:courseId', authenticateMiddleware.handle, authorize('admin', 'instructor'), validateRequest(updateCourseValidator), asyncHandler(controller.update))
  router.delete('/:courseId', authenticateMiddleware.handle, authorize('admin'), asyncHandler(controller.delete))
  return router
}
