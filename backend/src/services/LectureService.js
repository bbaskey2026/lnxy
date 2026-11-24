import { CrudService } from './CrudService.js'
import { LectureModel } from '../models/LectureModel.js'

export class LectureService extends CrudService {
  constructor(lectureRepository) {
    super(lectureRepository, LectureModel, 'Lecture')
  }
}
