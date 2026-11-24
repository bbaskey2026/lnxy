import crypto from 'node:crypto'
import { ConflictError } from '../../../core/errors/ConflictError.js'
import { AuthenticationError } from '../../../core/errors/AuthenticationError.js'
import { Roles } from '../../../core/constants/roles.js'
import { env } from '../../../config/env.config.js'

export class AuthService {
  constructor({ userRepository, passwordHasher, tokenService, jsonDatabase }) {
    this.userRepository = userRepository
    this.passwordHasher = passwordHasher
    this.tokenService = tokenService
    this.database = jsonDatabase
  }

  sanitizeUser(user) {
    const { passwordHash, refreshTokens, ...safeUser } = user
    return safeUser
  }

  async register(dto) {
    const existing = await this.userRepository.findByEmail(dto.email)
    if (existing) throw new ConflictError('An account already exists for this email')

    const user = {
      id: crypto.randomUUID(),
      name: dto.name,
      email: dto.email,
      passwordHash: await this.passwordHasher.hash(dto.password),
      role: Roles.STUDENT,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    await this.userRepository.create(user)
    return this.createSession(user)
  }

  async login(dto) {
    const user = await this.userRepository.findByEmail(dto.email)
    if (!user || user.status !== 'active') throw new AuthenticationError('Invalid email or password')

    const passwordMatches = await this.passwordHasher.verify(user.passwordHash, dto.password)
    if (!passwordMatches) throw new AuthenticationError('Invalid email or password')
    return this.createSession(user)
  }

  async createSession(user) {
    const accessToken = this.tokenService.signAccessToken(user)
    const refreshRecord = this.tokenService.createRefreshTokenRecord(user.id)
    const refreshTokens = await this.database.read('refresh-tokens')
    refreshTokens.push(refreshRecord)
    await this.database.write('refresh-tokens', refreshTokens)

    return {
      accessToken,
      refreshToken: this.encodeRefreshToken(refreshRecord, user.id),
      user: this.sanitizeUser(user),
      refreshExpiresAt: refreshRecord.expiresAt,
    }
  }

  encodeRefreshToken(record, userId) {
    return `${record.id}.${userId}.${Buffer.from(record.tokenHash).toString('base64url')}`
  }

  async refresh(refreshToken) {
    const parts = refreshToken?.split('.')
    if (!parts || parts.length !== 3) throw new AuthenticationError('Refresh session is invalid')
    const [recordId, userId] = parts
    const records = await this.database.read('refresh-tokens')
    const record = records.find((item) => item.id === recordId && item.userId === userId)
    if (!record || record.revoked || new Date(record.expiresAt).getTime() <= Date.now()) {
      throw new AuthenticationError('Refresh session has expired')
    }

    const user = await this.userRepository.findById(userId)
    if (!user || user.status !== 'active') throw new AuthenticationError('Account is unavailable')
    return this.createSession(user)
  }

  async logout(refreshToken) {
    const recordId = refreshToken?.split('.')[0]
    if (!recordId) return
    const records = await this.database.read('refresh-tokens')
    const record = records.find((item) => item.id === recordId)
    if (record) record.revoked = true
    await this.database.write('refresh-tokens', records)
  }

  cookieOptions() {
    return {
      httpOnly: true,
      secure: env.cookieSecure,
      sameSite: env.cookieSecure ? 'none' : 'lax',
      path: '/api/auth',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    }
  }
}
