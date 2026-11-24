import jwt from 'jsonwebtoken'
import { env } from '../config/env.config.js'
import { ApiError } from '../utils/ApiError.js'

export class AuthenticateMiddleware {
  constructor(userRepository) {
    this.userRepository = userRepository
  }

  handle = async (req, res, next) => {
    try {
      const header = req.get('authorization')
      const token = header?.startsWith('Bearer ') ? header.slice(7) : null
      if (!token) throw new ApiError('Authentication required', 401, 'AUTHENTICATION_ERROR')
      const payload = jwt.verify(token, env.JWT_ACCESS_SECRET, { issuer: 'exampro-api' })
      const user = await this.userRepository.findById(payload.sub)
      if (!user || user.status !== 'active') throw new ApiError('Account is unavailable', 401, 'AUTHENTICATION_ERROR')
      const { passwordHash, refreshTokens, ...safeUser } = user
      req.user = safeUser
      next()
    } catch (error) {
      next(error instanceof ApiError
        ? error
        : new ApiError('Access token is invalid or expired', 401, 'AUTHENTICATION_ERROR'))
    }
  }
}
