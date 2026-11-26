import { ApiError } from '../../utils/ApiError.js'
import { UserModel } from '../../models/UserModel.js'

export class AuthService {
  constructor({ userRepository, refreshTokenRepository, passwordHasher, tokenService }) {
    this.userRepository = userRepository
    this.refreshTokenRepository = refreshTokenRepository
    this.passwordHasher = passwordHasher
    this.tokenService = tokenService
  }

  async register(dto) {
    if (await this.userRepository.findByEmail(dto.email)) {
      throw new ApiError('An account already exists for this email', 409, 'CONFLICT')
    }
    const passwordHash = await this.passwordHasher.hash(dto.password)
    const user = UserModel.create(dto, passwordHash)
    await this.userRepository.create(user)
    return this.createSession(user)
  }

  async login(dto) {
    const user = await this.userRepository.findByEmail(dto.email)
    let passwordMatches = false
    if (user) {
      passwordMatches = await this.passwordHasher.verify(user.passwordHash, dto.password)
    } else {
      await this.passwordHasher.hash(dto.password)
    }
    if (!user || user.status !== 'active' || !passwordMatches) {
      throw new ApiError('Invalid email or password', 401, 'AUTHENTICATION_ERROR')
    }
    return this.createSession(user)
  }

  async createSession(user) {
    const sessionUser = await this.userRepository.findByIdWithStore(user.id)
    if (!sessionUser) throw new ApiError('Account is unavailable', 401, 'AUTHENTICATION_ERROR')
    const accessToken = this.tokenService.signAccessToken(sessionUser)
    const { refreshToken, record } = this.tokenService.createRefreshToken(user.id)
    await this.refreshTokenRepository.create(record)
    return {
      accessToken,
      refreshToken,
      refreshExpiresAt: record.expiresAt,
      user: UserModel.normalize(sessionUser),
    }
  }

  async getProfile(userId) {
    const user = await this.userRepository.findByIdWithStore(userId)
    if (!user) throw new ApiError('User not found', 404, 'NOT_FOUND')
    return UserModel.normalize(user)
  }

  async refresh(refreshToken) {
    if (!refreshToken) throw new ApiError('Refresh session is invalid', 401, 'AUTHENTICATION_ERROR')
    const record = await this.refreshTokenRepository.consumeByHash(this.tokenService.hashRefreshToken(refreshToken))
    if (!record) throw new ApiError('Refresh session is invalid or expired', 401, 'AUTHENTICATION_ERROR')
    const user = await this.userRepository.findById(record.userId)
    if (!user || user.status !== 'active') throw new ApiError('Account is unavailable', 401, 'AUTHENTICATION_ERROR')
    return this.createSession(user)
  }

  async logout(refreshToken) {
    if (!refreshToken) return
    await this.refreshTokenRepository.revokeByHash(this.tokenService.hashRefreshToken(refreshToken))
  }
}
