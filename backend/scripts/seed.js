import crypto from 'node:crypto'
import { PasswordHasher } from '../src/infrastructure/security/PasswordHasher.js'
import { JsonDatabase } from '../src/database/json/JsonDatabase.js'
import { env } from '../src/config/env.config.js'

const database = new JsonDatabase(env.JSON_DATA_DIRECTORY)
const hasher = new PasswordHasher()

const users = [
  { name: 'Aarav Sharma', email: 'aarav@example.com', password: 'student123', role: 'student' },
  { name: 'Rohit Sharma', email: 'instructor@exampro.com', password: 'instructor123', role: 'instructor' },
  { name: 'Neha Admin', email: 'admin@exampro.com', password: 'admin123', role: 'admin' },
]

const seededUsers = []
for (const user of users) {
  seededUsers.push({
    id: crypto.randomUUID(),
    name: user.name,
    email: user.email,
    passwordHash: await hasher.hash(user.password),
    role: user.role,
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  })
}

await database.write('users', seededUsers)
await database.write('refresh-tokens', [])
await database.write('subjects', [])
await database.write('topics', [])
await database.write('courses', [
  {
    id: crypto.randomUUID(),
    instructorId: seededUsers[1].id,
    instructorName: 'Rohit Sharma',
    title: 'SSC CGL Complete Foundation',
    description: 'A complete preparation course covering Quantitative Aptitude, Reasoning, English, and General Studies.',
    category: 'SSC',
    rating: 4.8,
    studentCount: 18420,
    lectureCount: 86,
    duration: '64h',
    progress: 68,
    isPublished: true,
    modules: [
      { title: 'Quantitative Aptitude', lessons: 24 },
      { title: 'Reasoning Ability', lessons: 22 },
      { title: 'English Language', lessons: 18 },
      { title: 'General Studies', lessons: 22 },
    ],
  },
  {
    id: crypto.randomUUID(),
    instructorId: seededUsers[2].id,
    instructorName: 'Priya Das',
    title: 'OSSSC RI, ARI & AMIN Masterclass',
    description: 'Focused preparation for Odisha Revenue and Inspector examinations with local current affairs.',
    category: 'Odisha',
    rating: 4.7,
    studentCount: 9650,
    lectureCount: 72,
    duration: '52h',
    progress: 44,
    isPublished: true,
    modules: [
      { title: 'Arithmetic', lessons: 20 },
      { title: 'Mental Ability', lessons: 16 },
      { title: 'Odisha GK', lessons: 21 },
      { title: 'Odisha Current Affairs', lessons: 15 },
    ],
  },
])
await database.write('lectures', [])
await database.write('materials', [])
await database.write('questions', [])
await database.write('mock-tests', [])
await database.write('attempts', [])
await database.write('results', [])
await database.write('bookmarks', [])
await database.write('notes', [])
await database.write('notifications', [])
await database.write('user-notifications', [])
await database.write('current-affairs', [])
await database.write('previous-papers', [])
await database.write('exams', [
  {
    id: crypto.randomUUID(),
    name: 'SSC CGL',
    slug: 'ssc-cgl',
    category: 'SSC Examinations',
    description: 'Graduate-level positions across central government departments.',
    eligibility: 'Bachelor degree from a recognized university.',
    pattern: 'Tier I and Tier II objective examinations.',
    totalMarks: 200,
    durationMinutes: 60,
    negativeMarking: 0.5,
    subjects: ['Quantitative Aptitude', 'Reasoning', 'English', 'General Studies'],
    status: 'active',
  },
  {
    id: crypto.randomUUID(),
    name: 'OSSSC RI',
    slug: 'osssc-ri',
    category: 'Odisha Government',
    description: 'Revenue Inspector recruitment examination.',
    eligibility: '12th pass and Odisha residence requirements.',
    pattern: 'Preliminary and written stages.',
    totalMarks: 100,
    durationMinutes: 120,
    negativeMarking: 0.25,
    subjects: ['Arithmetic', 'Mental Ability', 'Odisha GK', 'General Knowledge'],
    status: 'active',
  },
])

console.log('JSON demo data seeded successfully.')
