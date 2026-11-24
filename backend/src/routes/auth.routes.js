import { Router } from 'express'
import { asyncHandler } from '../middleware/asyncHandler.js'
import { validateRequest } from '../middleware/validateRequest.js'
import { registerValidator, loginValidator } from '../validators/auth.validator.js'

export function createAuthRoutes(authController, authenticateMiddleware) {
  const router = Router()
  router.post('/register', validateRequest(registerValidator), asyncHandler(authController.register))
  router.post('/login', validateRequest(loginValidator), asyncHandler(authController.login))
  router.post('/refresh', asyncHandler(authController.refresh))
  router.post('/logout', asyncHandler(authController.logout))
  router.get('/me', authenticateMiddleware.handle, asyncHandler(authController.me))
  return router
}
