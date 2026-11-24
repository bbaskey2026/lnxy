import { ApiResponse } from '../utils/ApiResponse.js'

export class NoteController {
  constructor(noteService) {
    this.noteService = noteService
  }

  list = async (req, res) => res.json(ApiResponse.success(await this.noteService.listForUser(req.user.id)))
  create = async (req, res) => res.status(201).json(ApiResponse.success(await this.noteService.createForUser(req.user.id, req.validatedBody)))
  update = async (req, res) => res.json(ApiResponse.success(await this.noteService.updateForUser(req.user.id, req.params.noteId, req.validatedBody)))
  delete = async (req, res) => {
    await this.noteService.deleteForUser(req.user.id, req.params.noteId)
    res.json(ApiResponse.message('Note deleted successfully'))
  }
}
