import { ApiResponse } from '../utils/ApiResponse.js'

export class NotificationController {
  constructor(notificationService) {
    this.notificationService = notificationService
  }

  list = async (req, res) => res.json(ApiResponse.success(await this.notificationService.listForUser(req.user.id)))
  markRead = async (req, res) => res.json(ApiResponse.success(await this.notificationService.markRead(req.user.id, req.params.notificationId)))
}
