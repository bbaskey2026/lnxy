import jwt from 'jsonwebtoken'
import crypto from 'node:crypto'
import { env } from '../../config/env.config.js'

export class TokenService {
  signAccessToken(user) {
    return jwt.sign(
      { sub: user.id, role: user.role, email: user.email },
      env.JWT_ACCESS_SECRET,
      { expiresIn: env.JWT_ACCESS_TTL, issuer: 'exampro-api' },
    )
  }

  verifyAccessToken(token) {
    return jwt.verify(token, env.JWT_ACCESS_SECRET, { issuer: 'exampro-api' })
  }

  createRefreshTokenRecord(userId) {
    const token = crypto.randomBytes(48).toString('hex')
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7)
    return {
      id: crypto.randomUUID(),
      userId,
      tokenHash: crypto.createHash('sha256').update(token).digest('hex'),
      expiresAt: expiresAt.toISOString(),
      revoked: false,
      createdAt: new Date().toISOString(),
    }
  }

  hashRefreshToken(token) {
    return crypto.createHash('sha256').update(token).digest('hex')
  }
}
