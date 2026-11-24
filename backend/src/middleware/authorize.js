import { ApiError } from '../utils/ApiError.js'

export function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return next(new ApiError('You do not have permission to perform this action', 403, 'AUTHORIZATION_ERROR'))
    }
    next()
  }
}
