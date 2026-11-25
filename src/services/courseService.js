import { axiosClient } from '../api/axiosClient'

export const courseService = {
  async list() {
    const response = await axiosClient.get('/courses')
    return response.data.data
  },

  async getById(courseId) {
    const response = await axiosClient.get(`/courses/${courseId}`)
    return response.data.data
  },

  async listEnrolled() {
    const response = await axiosClient.get('/courses/enrolled')
    return response.data.data
  },

  async enroll(courseId) {
    const response = await axiosClient.post(`/courses/${courseId}/enroll`)
    return response.data.data
  },
}
