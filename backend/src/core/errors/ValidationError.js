import { AppError } from './AppError.js'

export class ValidationError extends AppError {
  constructor(message = 'Request validation failed', details) {
    super(message, 422, 'VALIDATION_ERROR', details)
  }
}
