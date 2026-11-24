import { ApiError } from '../utils/ApiError.js'

export class NotificationService {
  constructor(database) {
    this.database = database
  }

  async listForUser(userId) {
    const notifications = await this.database.read('notifications')
    const userNotifications = await this.database.read('user-notifications')
    return notifications
      .filter((item) => userNotifications.some((link) => link.notificationId === item.id && link.userId === userId))
      .map((item) => ({
        ...item,
        isRead: Boolean(userNotifications.find((link) => link.notificationId === item.id && link.userId === userId)?.isRead),
      }))
  }

  async markRead(userId, notificationId) {
    const links = await this.database.read('user-notifications')
    const link = links.find((item) => item.userId === userId && item.notificationId === notificationId)
    if (!link) throw new ApiError('Notification not found', 404, 'NOT_FOUND')
    link.isRead = true
    link.readAt = new Date().toISOString()
    await this.database.write('user-notifications', links)
    return link
  }
}
