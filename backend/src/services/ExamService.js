import { CrudService } from './CrudService.js'
import { ExamModel } from '../models/ExamModel.js'
import { ApiError } from '../utils/ApiError.js'

export class ExamService extends CrudService {
  constructor(examRepository) {
    super(examRepository, ExamModel, 'Examination')
  }

  async create(dto) {
    const exam = ExamModel.create(dto)
    const duplicate = (await this.repository.findAll()).find((item) => item.slug === exam.slug)
    if (duplicate) throw new ApiError('An examination with this name or slug already exists', 409, 'CONFLICT')
    return this.repository.create(exam)
  }
}
