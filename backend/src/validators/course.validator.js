import { z } from 'zod'

export const createCourseValidator = z.object({
  instructorId: z.string().uuid(),
  title: z.string().trim().min(2).max(200),
  description: z.string().trim().max(4000).optional(),
  category: z.string().trim().min(2).max(100).optional(),
  rating: z.number().min(0).max(5).optional(),
  lectureCount: z.number().int().nonnegative().optional(),
  duration: z.string().trim().max(30).optional(),
  isPublished: z.boolean().optional(),
})

export const updateCourseValidator = createCourseValidator.partial()
