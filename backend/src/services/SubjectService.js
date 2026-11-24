import { CrudService } from './CrudService.js'
import { SubjectModel } from '../models/SubjectModel.js'

export class SubjectService extends CrudService {
  constructor(subjectRepository) {
    super(subjectRepository, SubjectModel, 'Subject')
  }
}
