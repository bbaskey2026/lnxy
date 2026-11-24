import { ApiResponse } from '../../../core/responses/ApiResponse.js'

export class ExamController {
  constructor({ examService }) {
    this.examService = examService
  }

  list = async (req, res) => {
    res.json(ApiResponse.success(await this.examService.list()))
  }

  getById = async (req, res) => {
    res.json(ApiResponse.success(await this.examService.getById(req.params.examId)))
  }

  create = async (req, res) => {
    const exam = await this.examService.create(req.validatedBody)
    res.status(201).json(ApiResponse.success(exam))
  }

  update = async (req, res) => {
    res.json(ApiResponse.success(await this.examService.update(req.params.examId, req.validatedBody)))
  }

  delete = async (req, res) => {
    await this.examService.delete(req.params.examId)
    res.json(ApiResponse.message('Examination deleted successfully'))
  }
}
