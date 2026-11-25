export class AnalyticsService {
  constructor(attemptRepository, resultRepository) {
    this.attemptRepository = attemptRepository
    this.resultRepository = resultRepository
  }

  async getForUser(userId) {
    const attempts = await this.attemptRepository.findAll({ userId })
    const results = await this.resultRepository.findAll({ userId })
    const submittedAttempts = attempts.filter((attempt) => attempt.status === 'submitted')
    const averageAccuracy = results.length
      ? Number((results.reduce((sum, result) => sum + result.accuracy, 0) / results.length).toFixed(1))
      : 0
    return {
      preparationProgress: averageAccuracy,
      studyHours: null,
      mockTestsTaken: submittedAttempts.length,
      averageAccuracy,
      weeklyPerformance: [],
      subjectAccuracy: [],
      topicAccuracy: [],
      strongTopics: [],
      weakTopics: [],
      recommendations: [],
    }
  }
}
