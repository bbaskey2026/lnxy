import { API_ENDPOINTS } from '../api/endpoints'
import { createCrudService } from './crudService'

export const courseService = createCrudService(API_ENDPOINTS.courses, 'courseId')
