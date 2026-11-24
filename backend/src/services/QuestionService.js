import { CrudService } from './CrudService.js'
import { QuestionModel } from '../models/QuestionModel.js'

export class QuestionService extends CrudService {
  constructor(questionRepository) {
    super(questionRepository, QuestionModel, 'Question')
  }
}
