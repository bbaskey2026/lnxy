export class ApiResponse {
  static success(data, meta) {
    return meta ? { success: true, data, meta } : { success: true, data }
  }

  static message(message, data) {
    return { success: true, message, ...(data ? { data } : {}) }
  }

  static error(error, requestId) {
    return {
      success: false,
      error: {
        code: error.code ?? 'INTERNAL_ERROR',
        message: error.message,
        ...(error.details ? { details: error.details } : {}),
        ...(requestId ? { requestId } : {}),
      },
    }
  }
}
