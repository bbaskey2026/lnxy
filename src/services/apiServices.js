import { api } from '../api/api'
import { API_ENDPOINTS } from '../api/endpoints'
import { createCrudService } from './crudService'

export const userService = createCrudService(API_ENDPOINTS.users, 'userId')
export const subjectService = createCrudService(API_ENDPOINTS.subjects, 'subjectId')
export const topicService = createCrudService(API_ENDPOINTS.topics, 'topicId')
export const lectureService = createCrudService(API_ENDPOINTS.lectures, 'lectureId')
export const studyMaterialService = createCrudService(API_ENDPOINTS.studyMaterials, 'materialId')
export const questionService = createCrudService(API_ENDPOINTS.questions, 'questionId')
export const mockTestService = createCrudService(API_ENDPOINTS.mockTests, 'mockTestId')

export const attemptService = {
  start(mockTestId) {
    return api.post(API_ENDPOINTS.attempts.list, { mockTestId })
  },
  saveAnswer(attemptId, answer) {
    return api.patch(API_ENDPOINTS.attempts.answers(attemptId), answer)
  },
  submit(attemptId) {
    return api.post(API_ENDPOINTS.attempts.submit(attemptId))
  },
}

export const resultService = {
  list() {
    return api.get(API_ENDPOINTS.results.list)
  },
  getByAttempt(attemptId) {
    return api.get(API_ENDPOINTS.results.byAttempt(attemptId))
  },
}

export const bookmarkService = {
  list() {
    return api.get(API_ENDPOINTS.bookmarks.list)
  },
  toggle(bookmark) {
    return api.post(API_ENDPOINTS.bookmarks.toggle, bookmark)
  },
}

export const noteService = createCrudService(API_ENDPOINTS.notes, 'noteId')

export const notificationService = {
  list() {
    return api.get(API_ENDPOINTS.notifications.list)
  },
  markRead(notificationId) {
    return api.patch(API_ENDPOINTS.notifications.markRead(notificationId))
  },
}

export const analyticsService = {
  me() {
    return api.get(API_ENDPOINTS.analytics.me)
  },
}
