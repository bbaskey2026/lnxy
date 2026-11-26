import crypto from 'node:crypto'
import { JsonDatabase } from '../src/database/json/JsonDatabase.js'
import { env } from '../src/config/env.js'
import { createMockTestFixtures } from './mockTestFixtures.js'

const database = new JsonDatabase(env.JSON_DATA_DIRECTORY)
const exams = await database.read('exams')

const requiredExams = [
  {
    name: 'SSC CGL',
    slug: 'ssc-cgl',
    category: 'SSC Examinations',
    description: 'Graduate-level positions across central government departments.',
    subjects: ['Quantitative Aptitude', 'Reasoning', 'English', 'General Studies'],
    durationMinutes: 60,
    negativeMarking: 0.5,
  },
  {
    name: 'OSSSC RI',
    slug: 'osssc-ri',
    category: 'Odisha Government',
    description: 'Revenue Inspector recruitment examination.',
    subjects: ['Arithmetic', 'Mental Ability', 'Odisha GK', 'General Knowledge'],
    durationMinutes: 120,
    negativeMarking: 0.25,
  },
]

for (const exam of requiredExams) {
  if (exams.some((existing) => existing.slug === exam.slug || existing.name === exam.name)) continue
  const now = new Date().toISOString()
  exams.push({
    id: crypto.randomUUID(),
    ...exam,
    eligibility: '',
    pattern: '',
    totalMarks: 0,
    isActive: true,
    status: 'active',
    createdAt: now,
    updatedAt: now,
  })
}

const { questions, mockTests } = createMockTestFixtures(exams)
const existingQuestions = await database.read('questions')
const existingMockTests = await database.read('mock-tests')
const upsertById = (existing, incoming) => [
  ...existing.filter((record) => !incoming.some((item) => item.id === record.id)),
  ...incoming,
]

await database.write('exams', exams)
await database.write('questions', upsertById(existingQuestions, questions))
await database.write('mock-tests', upsertById(existingMockTests, mockTests))

console.log('Mock test data seeded without replacing other collections.')
