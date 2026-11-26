import { ApiError } from '../utils/ApiError.js'

export function notFound(req, res, next) {
  next(new ApiError('API route not found', 404, 'NOT_FOUND'))
}
