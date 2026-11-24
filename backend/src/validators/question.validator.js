import { z } from 'zod'

export const createQuestionValidator = z.object({
  examId: z.string().uuid().optional(),
  subjectId: z.string().uuid().optional(),
  topicId: z.string().uuid().optional(),
  text: z.string().trim().min(2).max(5000),
  type: z.enum(['MCQ', 'True/False']).default('MCQ'),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']).default('Medium'),
  options: z.array(z.string().trim().min(1)).min(2),
  correctOptionIndex: z.number().int().nonnegative(),
  explanation: z.string().trim().max(5000).optional(),
  solutionSteps: z.array(z.string()).optional(),
  isPreviousYear: z.boolean().optional(),
  year: z.number().int().min(1900).max(2100).optional(),
})

export const updateQuestionValidator = createQuestionValidator.partial()
