import crypto from 'node:crypto'
import { ConflictError } from '../../../core/errors/ConflictError.js'
import { NotFoundError } from '../../../core/errors/NotFoundError.js'

export class ExamService {
  constructor({ examRepository }) {
    this.examRepository = examRepository
  }

  async list() {
    return this.examRepository.findAll()
  }

  async getById(id) {
    const exam = await this.examRepository.findById(id)
    if (!exam) throw new NotFoundError('Examination')
    return exam
  }

  async create(dto) {
    const slug = dto.slug ?? dto.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    const existing = (await this.examRepository.findAll()).find((exam) => exam.slug === slug)
    if (existing) throw new ConflictError('An examination with this name or slug already exists')
    return this.examRepository.create({
      id: crypto.randomUUID(),
      ...dto,
      slug,
      subjects: dto.subjects ?? [],
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
  }

  async update(id, dto) {
    await this.getById(id)
    const exam = await this.examRepository.update(id, dto)
    if (!exam) throw new NotFoundError('Examination')
    return exam
  }

  async delete(id) {
    await this.getById(id)
    await this.examRepository.delete(id)
  }
}
