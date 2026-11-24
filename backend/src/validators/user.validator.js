import { z } from 'zod'

export const updateUserValidator = z.object({
  name: z.string().trim().min(2).max(100).optional(),
  targetExam: z.string().trim().max(150).nullable().optional(),
  role: z.enum(['student', 'instructor', 'admin']).optional(),
  status: z.enum(['active', 'suspended']).optional(),
})
