export class ApiResponse {
  static success(data, meta) {
    const body = { success: true, data }
    if (meta) body.meta = meta
    return body
  }

  static message(message, data) {
    return { success: true, message, ...(data ? { data } : {}) }
  }

  static error(error, requestId) {
    return {
      success: false,
      error: {
        code: error.code ?? 'INTERNAL_ERROR',
        message: error.message ?? 'Unexpected server error',
        ...(error.details ? { details: error.details } : {}),
        ...(requestId ? { requestId } : {}),
      },
    }
  }
}
