import { CrudController } from './CrudController.js'
import { ApiResponse } from '../utils/ApiResponse.js'

export class ExamController extends CrudController {
  constructor(examService) {
    super(examService)
  }

  getById = async (req, res) => {
    res.json(ApiResponse.success(await this.service.getById(req.params.examId)))
  }
}
