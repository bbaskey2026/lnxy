import { CrudService } from './CrudService.js'
import { StudyMaterialModel } from '../models/StudyMaterialModel.js'

export class StudyMaterialService extends CrudService {
  constructor(studyMaterialRepository) {
    super(studyMaterialRepository, StudyMaterialModel, 'Study material')
  }
}
