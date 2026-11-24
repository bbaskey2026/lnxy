import { axiosClient } from '../api/axiosClient'

export const examService = {
  async list() {
    const response = await axiosClient.get('/exams')
    return response.data.data
  },

  async getById(examId) {
    const response = await axiosClient.get(`/exams/${examId}`)
    return response.data.data
  },
}
