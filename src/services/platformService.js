import { axiosClient } from '../api/axiosClient'

const requestData = async (request, fallbackMessage) => {
  try {
    const response = await request
    return response.data.data
  } catch (error) {
    throw new Error(error.response?.data?.error?.message ?? fallbackMessage)
  }
}

export const platformService = {
  listCurrentAffairs: () => requestData(axiosClient.get('/current-affairs'), 'Unable to load current affairs.'),
  listStudyMaterials: () => requestData(axiosClient.get('/study-materials'), 'Unable to load study materials.'),
  listLectures: () => requestData(axiosClient.get('/lectures'), 'Unable to load lectures.'),
  listQuestions: () => requestData(axiosClient.get('/questions'), 'Unable to load practice questions.'),
  listPreviousPapers: () => requestData(axiosClient.get('/previous-papers'), 'Unable to load previous papers.'),
  getAnalytics: () => requestData(axiosClient.get('/analytics/me'), 'Unable to load analytics.'),
  listNotifications: () => requestData(axiosClient.get('/notifications'), 'Unable to load notifications.'),
  markNotificationRead: (notificationId) => requestData(
    axiosClient.patch(`/notifications/${notificationId}/read`),
    'Unable to update notification.',
  ),
  listUsers: () => requestData(axiosClient.get('/users'), 'Unable to load users.'),
  createExam: (exam) => requestData(axiosClient.post('/exams', exam), 'Unable to create examination.'),
  updateExam: (examId, changes) => requestData(axiosClient.patch(`/exams/${examId}`, changes), 'Unable to update examination.'),
  updateUser: (userId, changes) => requestData(axiosClient.patch(`/users/${userId}`, changes), 'Unable to update user.'),
}
