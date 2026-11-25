import { API_ENDPOINTS } from '../api/endpoints'
import { createCrudService } from './crudService'

export const examService = createCrudService(API_ENDPOINTS.exams, 'examId')
