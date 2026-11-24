import { z } from 'zod'

export const createMockTestValidator = z.object({
  examId: z.string().uuid().optional(),
  title: z.string().trim().min(2).max(200),
  category: z.string().trim().min(2).max(100),
  durationSeconds: z.number().int().positive(),
  positiveMarks: z.number().positive(),
  negativeMarks: z.number().min(0),
  questionIds: z.array(z.string().uuid()).min(1),
  isActive: z.boolean().optional(),
})

export const updateMockTestValidator = createMockTestValidator.partial()
