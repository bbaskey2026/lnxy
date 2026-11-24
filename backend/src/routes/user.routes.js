import { Router } from 'express'
import { asyncHandler } from '../middleware/asyncHandler.js'
import { authorize } from '../middleware/authorize.js'
import { validateRequest } from '../middleware/validateRequest.js'
import { updateUserValidator } from '../validators/user.validator.js'

export function createUserRoutes(userController, authenticateMiddleware) {
  const router = Router()
  router.use(authenticateMiddleware.handle)
  router.get('/', authorize('admin'), asyncHandler(userController.list))
  router.get('/:userId', authorize('admin', 'student'), asyncHandler(userController.getById))
  router.patch('/:userId', authorize('admin', 'student'), validateRequest(updateUserValidator), asyncHandler(userController.update))
  router.delete('/:userId', authorize('admin'), asyncHandler(userController.delete))
  return router
}
