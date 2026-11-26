import pino from 'pino'

export function createLogger(env) {
  return pino({
    level: env.NODE_ENV === 'development' ? 'debug' : 'info',
    redact: {
      paths: [
        'password',
        'passwordHash',
        'token',
        'tokenHash',
        'refreshToken',
        'req.body.password',
        'req.body.token',
        'req.body.refreshToken',
        'req.cookies.refreshToken',
        'req.headers.authorization',
        'req.headers.cookie',
        'res.headers["set-cookie"]',
      ],
      censor: '[REDACTED]',
    },
  })
}
