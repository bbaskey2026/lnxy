import { ApiResponse } from '../utils/ApiResponse.js'

export function errorHandler(logger) {
  return (error, req, res, next) => {
    if (res.headersSent) return next(error)
    const statusCode = error.statusCode || 500
    if (statusCode >= 500) logger.error({ err: error, requestId: req.requestId }, 'Unhandled API error')
    res.status(statusCode).json(ApiResponse.error(error, req.requestId))
  }
}
