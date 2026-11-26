export class NoteController {
  constructor(noteService) {
    this.noteService = noteService
  }

  list = async (req, res) => {
    const data = await this.noteService.listForUser(req.user.id)
    return res.status(200).json({
      status: 'SUCCESS',
      statusCode: 0,
      statusDesc: 'Notes fetched successfully',
      data,
    })
  }

  create = async (req, res) => {
    const data = await this.noteService.createForUser(req.user.id, req.validatedBody)
    return res.status(201).json({
      status: 'SUCCESS',
      statusCode: 0,
      statusDesc: 'Note created successfully',
      data,
    })
  }

  update = async (req, res) => {
    const data = await this.noteService.updateForUser(req.user.id, req.params.noteId, req.validatedBody)
    return res.status(200).json({
      status: 'SUCCESS',
      statusCode: 0,
      statusDesc: 'Note updated successfully',
      data,
    })
  }

  delete = async (req, res) => {
    await this.noteService.deleteForUser(req.user.id, req.params.noteId)
    return res.status(200).json({
      status: 'SUCCESS',
      statusCode: 0,
      statusDesc: 'Note deleted successfully',
      data: { message: 'Note deleted successfully' },
    })
  }
}
