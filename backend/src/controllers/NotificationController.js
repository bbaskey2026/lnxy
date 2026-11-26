export class NotificationController {
  constructor(notificationService) {
    this.notificationService = notificationService
  }

  list = async (req, res) => {
    const data = await this.notificationService.listForUser(req.user.id)
    return res.status(200).json({
      status: 'SUCCESS',
      statusCode: 0,
      statusDesc: 'Notifications fetched successfully',
      data,
    })
  }

  markRead = async (req, res) => {
    const data = await this.notificationService.markRead(req.user.id, req.params.notificationId)
    return res.status(200).json({
      status: 'SUCCESS',
      statusCode: 0,
      statusDesc: 'Notification marked as read successfully',
      data,
    })
  }
}
