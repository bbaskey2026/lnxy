import { CrudService } from './CrudService.js'
import { NoteModel } from '../models/NoteModel.js'
import { ApiError } from '../utils/ApiError.js'

export class NoteService extends CrudService {
  constructor(noteRepository) {
    super(noteRepository, NoteModel, 'Note')
  }

  async listForUser(userId) {
    return this.repository.findByUser(userId)
  }

  async createForUser(userId, dto) {
    return this.repository.create(NoteModel.create({ ...dto, userId }))
  }

  async updateForUser(userId, noteId, dto) {
    const note = await this.repository.findById(noteId)
    if (!note || note.userId !== userId) throw new ApiError('Note not found', 404, 'NOT_FOUND')
    return this.repository.update(noteId, dto)
  }

  async deleteForUser(userId, noteId) {
    const note = await this.repository.findById(noteId)
    if (!note || note.userId !== userId) throw new ApiError('Note not found', 404, 'NOT_FOUND')
    await this.repository.delete(noteId)
  }
}
