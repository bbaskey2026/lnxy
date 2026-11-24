import { ApiError } from '../utils/ApiError.js'

export function validateRequest(schema, source = 'body') {
  return (req, res, next) => {
    const result = schema.safeParse(req[source])
    if (!result.success) {
      return next(new ApiError('Request validation failed', 422, 'VALIDATION_ERROR',
        result.error.issues.map((issue) => ({
          field: issue.path.join('.') || source,
          message: issue.message,
        }))))
    }
    req.validatedBody = result.data
    next()
  }
}
