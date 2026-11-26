export class BookmarkController {
  constructor(bookmarkService) {
    this.bookmarkService = bookmarkService
  }

  list = async (req, res) => {
    const data = await this.bookmarkService.repository.findByUser(req.user.id)
    return res.status(200).json({
      status: 'SUCCESS',
      statusCode: 0,
      statusDesc: 'Bookmarks fetched successfully',
      data,
    })
  }

  toggle = async (req, res) => {
    const data = await this.bookmarkService.toggle(req.user.id, req.validatedBody)
    return res.status(200).json({
      status: 'SUCCESS',
      statusCode: 0,
      statusDesc: 'Bookmark updated successfully',
      data,
    })
  }
}
