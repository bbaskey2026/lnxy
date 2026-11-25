import { Router } from 'express'
import { asyncHandler } from '../middleware/asyncHandler.js'

export function createJsonCollectionRoutes(controller) {
  const router = Router()
  router.get('/', asyncHandler(controller.list))
  return router
}
