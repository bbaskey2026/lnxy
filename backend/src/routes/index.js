import { Router } from 'express'
import { env } from '../config/env.js'
import { createAuthRoutes } from '../modules/auth/auth.routes.js'
import { createUserRoutes } from '../modules/users/user.routes.js'
import { createExamRoutes } from '../modules/exams/exam.routes.js'
import { createSubjectRoutes } from './subject.routes.js'
import { createTopicRoutes } from './topic.routes.js'
import { createCourseRoutes } from '../modules/courses/course.routes.js'
import { createLectureRoutes } from './lecture.routes.js'
import { createStudyMaterialRoutes } from './study-material.routes.js'
import { createQuestionRoutes } from './question.routes.js'
import { createMockTestRoutes } from './mock-test.routes.js'
import { createAttemptRoutes } from './attempt.routes.js'
import { createResultRoutes } from './result.routes.js'
import { createBookmarkRoutes } from './bookmark.routes.js'
import { createNoteRoutes } from './note.routes.js'
import { createAnalyticsRoutes } from './analytics.routes.js'
import { createNotificationRoutes } from './notification.routes.js'
import { JsonCollectionController } from '../controllers/JsonCollectionController.js'
import { createJsonCollectionRoutes } from './json-collection.routes.js'

export function createApiRoutes(dependencies) {
  const router = Router()
  router.get('/health', (req, res) => {
    return res.status(200).json({
      status: 'SUCCESS',
      statusCode: 0,
      statusDesc: 'Health check successful',
      data: {
        status: 'ok',
        persistence: env.PERSISTENCE,
        timestamp: new Date().toISOString(),
      },
    })
  })
  const authRoutes = createAuthRoutes(dependencies.authController, dependencies.authenticateMiddleware)
  router.use('/auth', authRoutes)
  router.use('/user/auth', authRoutes)
  router.use('/users', createUserRoutes(dependencies.userController, dependencies.authenticateMiddleware))
  router.use('/exams', createExamRoutes(dependencies.examController, dependencies.authenticateMiddleware))
  router.use('/subjects', createSubjectRoutes(dependencies.subjectController, dependencies.authenticateMiddleware))
  router.use('/topics', createTopicRoutes(dependencies.topicController, dependencies.authenticateMiddleware))
  router.use('/courses', createCourseRoutes(dependencies.courseController, dependencies.authenticateMiddleware))
  router.use('/lectures', createLectureRoutes(dependencies.lectureController, dependencies.authenticateMiddleware))
  router.use('/study-materials', createStudyMaterialRoutes(dependencies.studyMaterialController, dependencies.authenticateMiddleware))
  router.use('/questions', createQuestionRoutes(dependencies.questionController, dependencies.authenticateMiddleware))
  router.use('/mock-tests', createMockTestRoutes(dependencies.mockTestController, dependencies.authenticateMiddleware))
  router.use('/attempts', createAttemptRoutes(dependencies.attemptController, dependencies.authenticateMiddleware))
  router.use('/results', createResultRoutes(dependencies.resultController, dependencies.authenticateMiddleware))
  router.use('/bookmarks', createBookmarkRoutes(dependencies.bookmarkController, dependencies.authenticateMiddleware))
  router.use('/notes', createNoteRoutes(dependencies.noteController, dependencies.authenticateMiddleware))
  router.use('/analytics', createAnalyticsRoutes(dependencies.analyticsController, dependencies.authenticateMiddleware))
  router.use('/notifications', createNotificationRoutes(dependencies.notificationController, dependencies.authenticateMiddleware))
  router.use('/current-affairs', createJsonCollectionRoutes(new JsonCollectionController(dependencies.database, 'current-affairs')))
  router.use('/previous-papers', createJsonCollectionRoutes(new JsonCollectionController(dependencies.database, 'previous-papers')))
  return router
}
