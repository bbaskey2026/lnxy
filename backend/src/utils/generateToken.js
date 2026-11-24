import jwt from 'jsonwebtoken'

export function generateAccessToken(payload, secret, expiresIn) {
  return jwt.sign(payload, secret, { expiresIn, issuer: 'exampro-api' })
}
