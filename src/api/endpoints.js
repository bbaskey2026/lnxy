export const API_ENDPOINTS = {
  health: '/health',
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    me: '/auth/me',
  },
  users: {
    list: '/users',
    byId: (userId) => `/users/${userId}`,
  },
  exams: {
    list: '/exams',
    byId: (examId) => `/exams/${examId}`,
  },
  subjects: {
    list: '/subjects',
    byId: (subjectId) => `/subjects/${subjectId}`,
  },
  topics: {
    list: '/topics',
    byId: (topicId) => `/topics/${topicId}`,
  },
  courses: {
    list: '/courses',
    byId: (courseId) => `/courses/${courseId}`,
  },
  lectures: {
    list: '/lectures',
    byId: (lectureId) => `/lectures/${lectureId}`,
  },
  studyMaterials: {
    list: '/study-materials',
    byId: (materialId) => `/study-materials/${materialId}`,
  },
  questions: {
    list: '/questions',
    byId: (questionId) => `/questions/${questionId}`,
  },
  mockTests: {
    list: '/mock-tests',
    byId: (mockTestId) => `/mock-tests/${mockTestId}`,
  },
  attempts: {
    list: '/attempts',
    answers: (attemptId) => `/attempts/${attemptId}/answers`,
    submit: (attemptId) => `/attempts/${attemptId}/submit`,
  },
  results: {
    list: '/results',
    byAttempt: (attemptId) => `/results/attempt/${attemptId}`,
  },
  bookmarks: {
    list: '/bookmarks',
    toggle: '/bookmarks/toggle',
  },
  notes: {
    list: '/notes',
    byId: (noteId) => `/notes/${noteId}`,
  },
  analytics: {
    me: '/analytics/me',
  },
  notifications: {
    list: '/notifications',
    markRead: (notificationId) => `/notifications/${notificationId}/read`,
  },
}
