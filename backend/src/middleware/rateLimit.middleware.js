import rateLimit from 'express-rate-limit'

export function createRateLimiter({ limit = 300, windowMs = 15 * 60 * 1000 } = {}) {
  return rateLimit({
    windowMs,
    limit,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    handler(req, res) {
      res.status(429).json({
        status: 'FAILED',
        statusCode: 1,
        statusDesc: 'Too many requests, please try again later.',
        data: {
          code: 'RATE_LIMIT_EXCEEDED',
          ...(req.requestId ? { requestId: req.requestId } : {}),
        },
      })
    },
  })
}
