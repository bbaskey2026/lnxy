import { BaseRepository } from '../../../core/interfaces/BaseRepository.js'

export class ExamRepository extends BaseRepository {
  constructor({ jsonDatabase }) {
    super()
    this.database = jsonDatabase
  }

  async findAll() {
    return this.database.read('exams')
  }

  async findById(id) {
    const exams = await this.findAll()
    return exams.find((exam) => exam.id === id) ?? null
  }

  async create(exam) {
    const exams = await this.findAll()
    exams.push(exam)
    await this.database.write('exams', exams)
    return exam
  }

  async update(id, changes) {
    const exams = await this.findAll()
    const index = exams.findIndex((exam) => exam.id === id)
    if (index === -1) return null
    exams[index] = { ...exams[index], ...changes, updatedAt: new Date().toISOString() }
    await this.database.write('exams', exams)
    return exams[index]
  }

  async delete(id) {
    const exams = await this.findAll()
    const remaining = exams.filter((exam) => exam.id !== id)
    if (remaining.length === exams.length) return false
    await this.database.write('exams', remaining)
    return true
  }
}
