import { env } from '../config/env.config.js'
import { JsonDatabase } from '../database/json/JsonDatabase.js'
import { PasswordHasher } from '../infrastructure/security/PasswordHasher.js'
import { TokenService } from '../infrastructure/security/TokenService.js'
import { UserRepository } from '../modules/users/repositories/UserRepository.js'
import { ExamRepository } from '../modules/exams/repositories/ExamRepository.js'
import { AuthService } from '../modules/auth/services/AuthService.js'
import { ExamService } from '../modules/exams/services/ExamService.js'
import { AuthController } from '../modules/auth/controllers/AuthController.js'
import { ExamController } from '../modules/exams/controllers/ExamController.js'
import { UserController } from '../modules/users/controllers/UserController.js'
import { AuthenticateMiddleware } from '../middleware/authenticate.js'

export class Container {
  constructor({ logger }) {
    this.config = { persistence: env.PERSISTENCE }
    this.logger = logger

    if (env.PERSISTENCE !== 'json') {
      throw new Error(`Persistence adapter "${env.PERSISTENCE}" is not implemented. Use PERSISTENCE=json for this phase.`)
    }

    // Manual composition root: constructors receive only explicit dependencies.
    this.jsonDatabase = new JsonDatabase(env.JSON_DATA_DIRECTORY)
    this.passwordHasher = new PasswordHasher()
    this.tokenService = new TokenService()

    this.userRepository = new UserRepository({ jsonDatabase: this.jsonDatabase })
    this.examRepository = new ExamRepository({ jsonDatabase: this.jsonDatabase })

    this.authService = new AuthService({
      userRepository: this.userRepository,
      passwordHasher: this.passwordHasher,
      tokenService: this.tokenService,
      jsonDatabase: this.jsonDatabase,
    })
    this.examService = new ExamService({ examRepository: this.examRepository })

    this.authController = new AuthController({ authService: this.authService })
    this.examController = new ExamController({ examService: this.examService })
    this.userController = new UserController({ userRepository: this.userRepository })
    this.authenticateMiddleware = new AuthenticateMiddleware({
      tokenService: this.tokenService,
      userRepository: this.userRepository,
    })
  }

  async initialize() {
    await this.jsonDatabase.initialize()
  }
}
