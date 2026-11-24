import pino from 'pino'
import { env } from './config/env.config.js'
import { createDatabase } from './config/database.js'
import { createApp } from './app.js'
import { createApiRoutes } from './routes/index.js'
import { AuthenticateMiddleware } from './middleware/authenticate.js'

import { UserRepository } from './repositories/UserRepository.js'
import { ExamRepository } from './repositories/ExamRepository.js'
import { SubjectRepository } from './repositories/SubjectRepository.js'
import { TopicRepository } from './repositories/TopicRepository.js'
import { CourseRepository } from './repositories/CourseRepository.js'
import { LectureRepository } from './repositories/LectureRepository.js'
import { StudyMaterialRepository } from './repositories/StudyMaterialRepository.js'
import { QuestionRepository } from './repositories/QuestionRepository.js'
import { MockTestRepository } from './repositories/MockTestRepository.js'
import { AttemptRepository } from './repositories/AttemptRepository.js'
import { ResultRepository } from './repositories/ResultRepository.js'
import { BookmarkRepository } from './repositories/BookmarkRepository.js'
import { NoteRepository } from './repositories/NoteRepository.js'

import { AuthService } from './services/AuthService.js'
import { UserService } from './services/UserService.js'
import { ExamService } from './services/ExamService.js'
import { SubjectService } from './services/SubjectService.js'
import { TopicService } from './services/TopicService.js'
import { CourseService } from './services/CourseService.js'
import { LectureService } from './services/LectureService.js'
import { StudyMaterialService } from './services/StudyMaterialService.js'
import { QuestionService } from './services/QuestionService.js'
import { MockTestService } from './services/MockTestService.js'
import { AttemptService } from './services/AttemptService.js'
import { ResultService } from './services/ResultService.js'
import { BookmarkService } from './services/BookmarkService.js'
import { NoteService } from './services/NoteService.js'
import { AnalyticsService } from './services/AnalyticsService.js'
import { NotificationService } from './services/NotificationService.js'

import { AuthController } from './controllers/AuthController.js'
import { UserController } from './controllers/UserController.js'
import { ExamController } from './controllers/ExamController.js'
import { SubjectController } from './controllers/SubjectController.js'
import { TopicController } from './controllers/TopicController.js'
import { CourseController } from './controllers/CourseController.js'
import { LectureController } from './controllers/LectureController.js'
import { StudyMaterialController } from './controllers/StudyMaterialController.js'
import { QuestionController } from './controllers/QuestionController.js'
import { MockTestController } from './controllers/MockTestController.js'
import { AttemptController } from './controllers/AttemptController.js'
import { ResultController } from './controllers/ResultController.js'
import { BookmarkController } from './controllers/BookmarkController.js'
import { NoteController } from './controllers/NoteController.js'
import { AnalyticsController } from './controllers/AnalyticsController.js'
import { NotificationController } from './controllers/NotificationController.js'

const logger = pino({ level: env.NODE_ENV === 'development' ? 'debug' : 'info' })
const database = createDatabase()
await database.initialize()

const userRepository = new UserRepository(database)
const examRepository = new ExamRepository(database)
const subjectRepository = new SubjectRepository(database)
const topicRepository = new TopicRepository(database)
const courseRepository = new CourseRepository(database)
const lectureRepository = new LectureRepository(database)
const studyMaterialRepository = new StudyMaterialRepository(database)
const questionRepository = new QuestionRepository(database)
const mockTestRepository = new MockTestRepository(database)
const attemptRepository = new AttemptRepository(database)
const resultRepository = new ResultRepository(database)
const bookmarkRepository = new BookmarkRepository(database)
const noteRepository = new NoteRepository(database)

const authenticateMiddleware = new AuthenticateMiddleware(userRepository)
const authService = new AuthService(userRepository, database)
const userService = new UserService(userRepository)
const examService = new ExamService(examRepository)
const subjectService = new SubjectService(subjectRepository)
const topicService = new TopicService(topicRepository)
const courseService = new CourseService(courseRepository)
const lectureService = new LectureService(lectureRepository)
const studyMaterialService = new StudyMaterialService(studyMaterialRepository)
const questionService = new QuestionService(questionRepository)
const mockTestService = new MockTestService(mockTestRepository)
const attemptService = new AttemptService(attemptRepository, mockTestRepository, questionRepository)
const resultService = new ResultService(resultRepository)
const bookmarkService = new BookmarkService(bookmarkRepository)
const noteService = new NoteService(noteRepository)
const analyticsService = new AnalyticsService(attemptRepository, resultRepository, lectureRepository)
const notificationService = new NotificationService(database)

const authController = new AuthController(authService)
const userController = new UserController(userService)
const examController = new ExamController(examService)
const subjectController = new SubjectController(subjectService)
const topicController = new TopicController(topicService)
const courseController = new CourseController(courseService)
const lectureController = new LectureController(lectureService)
const studyMaterialController = new StudyMaterialController(studyMaterialService)
const questionController = new QuestionController(questionService)
const mockTestController = new MockTestController(mockTestService)
const attemptController = new AttemptController(attemptService)
const resultController = new ResultController(resultService)
const bookmarkController = new BookmarkController(bookmarkService)
const noteController = new NoteController(noteService)
const analyticsController = new AnalyticsController(analyticsService)
const notificationController = new NotificationController(notificationService)

const router = createApiRoutes({
  authController,
  authenticateMiddleware,
  userController,
  examController,
  subjectController,
  topicController,
  courseController,
  lectureController,
  studyMaterialController,
  questionController,
  mockTestController,
  attemptController,
  resultController,
  bookmarkController,
  noteController,
  analyticsController,
  notificationController,
})

const app = createApp(router, logger)
const server = app.listen(env.PORT, () => {
  logger.info({ port: env.PORT, url: env.APP_URL }, 'ExamPro backend listening')
})

const shutdown = (signal) => {
  logger.info({ signal }, 'Shutdown requested')
  server.close((error) => {
    if (error) {
      logger.error({ err: error }, 'Server shutdown failed')
      process.exitCode = 1
    }
    process.exit()
  })
}

process.on('SIGTERM', () => shutdown('SIGTERM'))
process.on('SIGINT', () => shutdown('SIGINT'))
