export function errorHandler(logger) {
  return (error, req, res, next) => {
    if (res.headersSent) return next(error)
    const statusCode = error.statusCode || 500
    if (statusCode >= 500) logger.error({ err: error, requestId: req.requestId }, 'Unhandled API error')
    res.status(statusCode).json({
      status: 'FAILED',
      statusCode: 1,
      statusDesc: error.message ?? 'Request failed',
      data: {
        code: error.code ?? 'INTERNAL_ERROR',
        ...(error.details ? { details: error.details } : {}),
        ...(req.requestId ? { requestId: req.requestId } : {}),
      },
    })
  }
}
