import { z } from 'zod'

export const createExamSchema = z.object({
  name: z.string().trim().min(2).max(150),
  slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).optional(),
  category: z.string().trim().min(2).max(100),
  description: z.string().trim().max(2000).optional(),
  eligibility: z.string().trim().max(2000).optional(),
  pattern: z.string().trim().max(2000).optional(),
  totalMarks: z.number().int().nonnegative().optional(),
  durationMinutes: z.number().int().positive().optional(),
  negativeMarking: z.number().min(0).max(5).optional(),
})

export const updateExamSchema = createExamSchema.partial()
