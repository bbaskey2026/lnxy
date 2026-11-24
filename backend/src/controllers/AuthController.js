import { ApiResponse } from '../utils/ApiResponse.js'

export class AuthController {
  constructor(authService) {
    this.authService = authService
  }

  register = async (req, res) => {
    const session = await this.authService.register(req.validatedBody)
    res.cookie('refreshToken', session.refreshToken, this.refreshCookieOptions())
    res.status(201).json(ApiResponse.success({ accessToken: session.accessToken, user: session.user }))
  }

  login = async (req, res) => {
    const session = await this.authService.login(req.validatedBody)
    res.cookie('refreshToken', session.refreshToken, this.refreshCookieOptions())
    res.json(ApiResponse.success({ accessToken: session.accessToken, user: session.user }))
  }

  refresh = async (req, res) => {
    const session = await this.authService.refresh(req.cookies.refreshToken)
    res.cookie('refreshToken', session.refreshToken, this.refreshCookieOptions())
    res.json(ApiResponse.success({ accessToken: session.accessToken, user: session.user }))
  }

  logout = async (req, res) => {
    await this.authService.logout(req.cookies.refreshToken)
    res.clearCookie('refreshToken', { path: '/api/auth' })
    res.json(ApiResponse.message('Signed out successfully'))
  }

  me = async (req, res) => {
    res.json(ApiResponse.success(req.user))
  }

  refreshCookieOptions() {
    return { httpOnly: true, secure: false, sameSite: 'lax', path: '/api/auth', maxAge: 7 * 24 * 60 * 60 * 1000 }
  }
}
