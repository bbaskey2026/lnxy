import { env } from '../../config/env.js'

export class AuthController {
  constructor(authService) {
    this.authService = authService
  }

  register = async (req, res, next) => {
    this.log(req, 'info', 'auth.register.started', 'Authentication registration started')
    try {
      const session = await this.authService.register(req.validatedBody)
      res.cookie('refreshToken', session.refreshToken, this.refreshCookieOptions(session.refreshExpiresAt))
      this.log(req, 'info', 'auth.register.succeeded', 'Account registered successfully', { userId: session.user.id })
      return res.status(201).json({
        status: 'SUCCESS',
        statusCode: 0,
        statusDesc: 'Account registered successfully',
        data: { accessToken: session.accessToken, user: session.user },
      })
    } catch (error) {
      this.logFailure(req, 'auth.register.failed', 'Authentication registration failed', error)
      return next(error)
    }
  }

  login = async (req, res, next) => {
    this.log(req, 'info', 'auth.login.started', 'Authentication login started')
    try {
      const session = await this.authService.login(req.validatedBody)
      res.cookie('refreshToken', session.refreshToken, this.refreshCookieOptions(session.refreshExpiresAt))
      this.log(req, 'info', 'auth.login.succeeded', 'Login successful', { userId: session.user.id })
      return res.status(200).json({
        status: 'SUCCESS',
        statusCode: 0,
        statusDesc: 'Login successful',
        data: { accessToken: session.accessToken, user: session.user },
      })
    } catch (error) {
      this.logFailure(req, 'auth.login.failed', 'Authentication login failed', error)
      return next(error)
    }
  }

  refresh = async (req, res, next) => {
    this.log(req, 'info', 'auth.refresh.started', 'Authentication refresh started')
    try {
      const session = await this.authService.refresh(req.cookies.refreshToken)
      res.cookie('refreshToken', session.refreshToken, this.refreshCookieOptions(session.refreshExpiresAt))
      this.log(req, 'info', 'auth.refresh.succeeded', 'Session refreshed successfully', { userId: session.user.id })
      return res.status(200).json({
        status: 'SUCCESS',
        statusCode: 0,
        statusDesc: 'Session refreshed successfully',
        data: { accessToken: session.accessToken, user: session.user },
      })
    } catch (error) {
      this.logFailure(req, 'auth.refresh.failed', 'Authentication refresh failed', error)
      return next(error)
    }
  }

  logout = async (req, res, next) => {
    this.log(req, 'info', 'auth.logout.started', 'Authentication logout started')
    try {
      await this.authService.logout(req.cookies.refreshToken)
      res.clearCookie('refreshToken', { path: '/api' })
      this.log(req, 'info', 'auth.logout.succeeded', 'Signed out successfully')
      return res.status(200).json({
        status: 'SUCCESS',
        statusCode: 0,
        statusDesc: 'Signed out successfully',
        data: { message: 'Signed out successfully' },
      })
    } catch (error) {
      this.logFailure(req, 'auth.logout.failed', 'Authentication logout failed', error)
      return next(error)
    }
  }

  me = async (req, res, next) => {
    this.log(req, 'info', 'auth.profile.started', 'Authenticated profile requested', { userId: req.user.id })
    try {
      const user = await this.authService.getProfile(req.user.id)
      this.log(req, 'info', 'auth.profile.fetched', 'Authenticated profile fetched', { userId: user.id })
      return res.status(200).json({
        status: 'SUCCESS',
        statusCode: 0,
        statusDesc: 'User profile fetched successfully',
        data: user,
      })
    } catch (error) {
      this.logFailure(req, 'auth.profile.failed', 'Authenticated profile fetch failed', error)
      return next(error)
    }
  }

  log(req, level, event, message, fields = {}) {
    const requestLogger = req.log
    if (!requestLogger || typeof requestLogger[level] !== 'function') return

    requestLogger[level]({
      event,
      method: req.method,
      route: `${req.baseUrl}${req.route?.path ?? ''}`,
      requestId: req.requestId,
      ...fields,
    }, message)
  }

  logFailure(req, event, message, error) {
    const level = error.statusCode >= 500 ? 'error' : 'warn'
    this.log(req, level, event, message, {
      errorCode: error.code ?? 'INTERNAL_ERROR',
      httpStatus: error.statusCode ?? 500,
    })
  }

  refreshCookieOptions(expiresAt) {
    return {
      httpOnly: true,
      secure: env.cookieSecure,
      sameSite: env.cookieSecure ? 'none' : 'lax',
      path: '/api',
      maxAge: Math.max(0, new Date(expiresAt).getTime() - Date.now()),
    }
  }
}
