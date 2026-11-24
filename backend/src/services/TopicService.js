import { CrudService } from './CrudService.js'
import { TopicModel } from '../models/TopicModel.js'

export class TopicService extends CrudService {
  constructor(topicRepository) {
    super(topicRepository, TopicModel, 'Topic')
  }
}
