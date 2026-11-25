import { axiosClient } from '../api/axiosClient'

const getData = async (path, message) => {
  try {
    const response = await axiosClient.get(path)
    return response.data.data
  } catch (error) {
    throw new Error(error.response?.data?.error?.message ?? message)
  }
}

export const adminService = {
  listSection(section) {
    const endpoints = {
      exams: '/exams',
      courses: '/courses',
      materials: '/study-materials',
      users: '/users',
    }
    if (!endpoints[section]) return Promise.resolve([])
    return getData(endpoints[section], `Unable to load ${section}.`)
  },

  async getOverview() {
    const [users, courses, examinations, materials] = await Promise.all([
      this.listSection('users'),
      this.listSection('courses'),
      this.listSection('exams'),
      this.listSection('materials'),
    ])
    return { users, courses, examinations, materials }
  },
}
