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
}
