export class AnalyticsService {
  constructor(attemptRepository, resultRepository, lectureRepository) {
    this.attemptRepository = attemptRepository
    this.resultRepository = resultRepository
    this.lectureRepository = lectureRepository
  }

  async getForUser(userId) {
    const attempts = await this.attemptRepository.findAll({ userId })
    const results = await this.resultRepository.findAll({ userId })
    const averageAccuracy = results.length
      ? Number((results.reduce((sum, result) => sum + result.accuracy, 0) / results.length).toFixed(1))
      : 0
    const completedLectures = attempts.filter((attempt) => attempt.status === 'submitted').length
    return {
      preparationProgress: averageAccuracy,
      studyHours: 0,
      mockTestsTaken: attempts.length,
      completedLectures,
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
