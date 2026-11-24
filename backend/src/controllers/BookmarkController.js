import { ApiResponse } from '../utils/ApiResponse.js'

export class BookmarkController {
  constructor(bookmarkService) {
    this.bookmarkService = bookmarkService
  }

  list = async (req, res) => res.json(ApiResponse.success(await this.bookmarkService.repository.findByUser(req.user.id)))
  toggle = async (req, res) => res.json(ApiResponse.success(await this.bookmarkService.toggle(req.user.id, req.validatedBody)))
}
