import { Router } from 'express'
import { asyncHandler } from '../../middleware/asyncHandler.js'
import { validateRequest } from '../../middleware/validate.middleware.js'
import { createRateLimiter } from '../../middleware/rateLimit.middleware.js'
import { registerValidator, loginValidator } from './auth.validator.js'

export function createAuthRoutes(authController, authenticateMiddleware) {
  const router = Router()
  const authRateLimiter = createRateLimiter({ limit: 10 })
  const loginHandlers = [
    authRateLimiter,
    validateRequest(loginValidator),
    asyncHandler(authController.login),
  ]
  router.post('/register', authRateLimiter, validateRequest(registerValidator), asyncHandler(authController.register))
  router.post('/dashboard', ...loginHandlers)
  router.post('/login', ...loginHandlers)
  router.post('/refresh', authRateLimiter, asyncHandler(authController.refresh))
  router.post('/logout', asyncHandler(authController.logout))
  router.get('/me', authenticateMiddleware.handle, asyncHandler(authController.me))
  return router
}
