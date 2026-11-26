import jwt from 'jsonwebtoken'
import crypto from 'node:crypto'
import { env } from '../../config/env.js'

export class TokenService {
  signAccessToken(user) {
    return jwt.sign(
      { sub: user.id },
      env.JWT_ACCESS_SECRET,
      {
        algorithm: 'HS256',
        audience: 'exampro-api-client',
        expiresIn: env.JWT_ACCESS_TTL,
        issuer: 'exampro-api',
      },
    )
  }

  verifyAccessToken(token) {
    return jwt.verify(token, env.JWT_ACCESS_SECRET, {
      algorithms: ['HS256'],
      audience: 'exampro-api-client',
      issuer: 'exampro-api',
    })
  }

  createRefreshToken(userId) {
    const refreshToken = crypto.randomBytes(64).toString('base64url')
    const [, amount, unit] = env.JWT_REFRESH_TTL.match(/^(\d+)([smhd])$/)
    const unitInMilliseconds = { s: 1000, m: 60_000, h: 3_600_000, d: 86_400_000 }
    const expiresAt = new Date(Date.now() + Number(amount) * unitInMilliseconds[unit])
    return {
      refreshToken,
      record: {
        id: crypto.randomUUID(),
        userId,
        tokenHash: this.hashRefreshToken(refreshToken),
        expiresAt,
        revoked: false,
        createdAt: new Date().toISOString(),
      },
    }
  }

  hashRefreshToken(token) {
    return crypto.createHmac('sha256', env.JWT_REFRESH_SECRET).update(token).digest('hex')
  }
}
