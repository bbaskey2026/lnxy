import { ApiError } from '../utils/ApiError.js'

export class AuthenticateMiddleware {
  constructor(userRepository, tokenService) {
    this.userRepository = userRepository
    this.tokenService = tokenService
  }

  handle = async (req, res, next) => {
    try {
      const authorization = req.get('authorization')?.trim()
      const bearerToken = authorization?.match(/^Bearer\s+(.+)$/i)?.[1]
      const token = bearerToken ?? (authorization && !/\s/.test(authorization) ? authorization : null)
      if (!token) throw new ApiError('Authentication required', 401, 'AUTHENTICATION_ERROR')
      const payload = this.tokenService.verifyAccessToken(token)
      if (!payload || typeof payload !== 'object' || typeof payload.sub !== 'string') {
        throw new ApiError('Access token is invalid or expired', 401, 'AUTHENTICATION_ERROR')
      }
      const user = await this.userRepository.findById(payload.sub)
      if (!user || user.status !== 'active') throw new ApiError('Account is unavailable', 401, 'AUTHENTICATION_ERROR')
      const { passwordHash, refreshTokens, ...safeUser } = user
      req.user = safeUser
      next()
    } catch (error) {
      const authError = error instanceof ApiError
        ? error
        : new ApiError('Access token is invalid or expired', 401, 'AUTHENTICATION_ERROR')
      req.log?.warn({
        event: 'auth.access.denied',
        method: req.method,
        route: `${req.baseUrl}${req.route?.path ?? ''}`,
        requestId: req.requestId,
        errorCode: authError.code,
      }, 'Authentication denied')
      next(authError)
    }
  }
}
