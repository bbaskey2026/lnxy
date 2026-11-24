import argon2 from 'argon2'
import crypto from 'node:crypto'
import jwt from 'jsonwebtoken'
import { env } from '../config/env.config.js'
import { ApiError } from '../utils/ApiError.js'
import { UserModel } from '../models/UserModel.js'

export class AuthService {
  constructor(userRepository, database) {
    this.userRepository = userRepository
    this.database = database
  }

  async register(dto) {
    if (await this.userRepository.findByEmail(dto.email)) {
      throw new ApiError('An account already exists for this email', 409, 'CONFLICT')
    }
    const passwordHash = await argon2.hash(dto.password, { type: argon2.argon2id })
    const user = UserModel.create(dto, passwordHash)
    await this.userRepository.create(user)
    return this.createSession(user)
  }

  async login(dto) {
    const user = await this.userRepository.findByEmail(dto.email)
    if (!user || user.status !== 'active') throw new ApiError('Invalid email or password', 401, 'AUTHENTICATION_ERROR')
    if (!(await argon2.verify(user.passwordHash, dto.password))) {
      throw new ApiError('Invalid email or password', 401, 'AUTHENTICATION_ERROR')
    }
    return this.createSession(user)
  }

  async createSession(user) {
    const accessToken = jwt.sign(
      { sub: user.id, role: user.role, email: user.email },
      env.JWT_ACCESS_SECRET,
      { expiresIn: env.JWT_ACCESS_TTL, issuer: 'exampro-api' },
    )
    const refreshToken = crypto.randomBytes(48).toString('hex')
    const record = {
      id: crypto.randomUUID(),
      userId: user.id,
      tokenHash: crypto.createHash('sha256').update(refreshToken).digest('hex'),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      revoked: false,
      createdAt: new Date().toISOString(),
    }
    const records = await this.database.read('refresh-tokens')
    records.push(record)
    await this.database.write('refresh-tokens', records)
    return { accessToken, refreshToken, user: UserModel.normalize(user) }
  }

  async refresh(refreshToken) {
    if (!refreshToken) throw new ApiError('Refresh session is invalid', 401, 'AUTHENTICATION_ERROR')
    const hash = crypto.createHash('sha256').update(refreshToken).digest('hex')
    const records = await this.database.read('refresh-tokens')
    const record = records.find((item) => item.tokenHash === hash)
    if (!record || record.revoked || new Date(record.expiresAt).getTime() <= Date.now()) {
      throw new ApiError('Refresh session has expired', 401, 'AUTHENTICATION_ERROR')
    }
    const user = await this.userRepository.findById(record.userId)
    if (!user || user.status !== 'active') throw new ApiError('Account is unavailable', 401, 'AUTHENTICATION_ERROR')
    record.revoked = true
    await this.database.write('refresh-tokens', records)
    return this.createSession(user)
  }

  async logout(refreshToken) {
    if (!refreshToken) return
    const hash = crypto.createHash('sha256').update(refreshToken).digest('hex')
    const records = await this.database.read('refresh-tokens')
    const record = records.find((item) => item.tokenHash === hash)
    if (record) record.revoked = true
    await this.database.write('refresh-tokens', records)
  }
}
