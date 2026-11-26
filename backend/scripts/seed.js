import crypto from 'node:crypto'
import { PasswordHasher } from '../src/infrastructure/security/PasswordHasher.js'
import { MongoDatabase } from '../src/database/mongodb/MongoDatabase.js'
import { createDemoPurchase } from '../src/database/memory/demoPurchaseFixtures.js'
import { createLogger } from '../src/config/logger.js'
import { JsonDatabase } from '../src/database/json/JsonDatabase.js'
import { env } from '../src/config/env.js'
import { createMockTestFixtures } from './mockTestFixtures.js'

if (env.NODE_ENV === 'production') {
  throw new Error('The demo seed script cannot run in production.')
}

const database = new JsonDatabase(env.JSON_DATA_DIRECTORY)
const hasher = new PasswordHasher()
const logger = createLogger(env)

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

const exams = [
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
    isActive: true,
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
    isActive: true,
    status: 'active',
  },
]

const { questions, mockTests } = createMockTestFixtures(exams)
const demoCourseId = crypto.randomUUID()
const demoStudent = seededUsers.find((user) => user.email === 'aarav@example.com')
if (!demoStudent) throw new Error('The demo student account is required to seed purchases.')

const demoPurchases = [
  createDemoPurchase(
    demoStudent.id,
    mockTests[0].id,
    'mocktest',
    mockTests[0].title,
    9900,
    mockTests[0].mockTestType,
  ),
  createDemoPurchase(
    demoStudent.id,
    mockTests[1].id,
    'mocktest',
    mockTests[1].title,
    4900,
    mockTests[1].mockTestType,
  ),
  createDemoPurchase(
    demoStudent.id,
    mockTests[2].id,
    'mocktest',
    mockTests[2].title,
    2900,
    mockTests[2].mockTestType,
  ),
  createDemoPurchase(
    demoStudent.id,
    demoCourseId,
    'courses',
    'SSC CGL Complete Foundation',
    49900,
  ),
]

const mongoDatabase = new MongoDatabase({ logger })
await mongoDatabase.initialize()
try {
  const { User, RefreshToken, Purchase, Subscription } = mongoDatabase.getModels()
  const seedEmails = seededUsers.map((user) => user.email)
  const existingSeedUsers = await User.find({ email: { $in: seedEmails } })
    .select('id')
    .lean()
    .exec()
  const userIds = [...existingSeedUsers.map((user) => user.id), ...seededUsers.map((user) => user.id)]

  await Promise.all([
    RefreshToken.deleteMany({ userId: { $in: userIds } }).exec(),
    Purchase.deleteMany({ studentId: { $in: userIds } }).exec(),
    Subscription.deleteMany({ studentId: { $in: userIds } }).exec(),
    User.deleteMany({ email: { $in: seedEmails } }).exec(),
  ])
  await User.insertMany(seededUsers)
  await Purchase.insertMany(demoPurchases)
} finally {
  await mongoDatabase.close()
}

await database.write('subjects', [])
await database.write('topics', [])
await database.write('courses', [
  {
    id: demoCourseId,
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
await database.write('questions', questions)
await database.write('mock-tests', mockTests)
await database.write('attempts', [])
await database.write('results', [])
await database.write('bookmarks', [])
await database.write('notes', [])
await database.write('notifications', [])
await database.write('user-notifications', [])
await database.write('current-affairs', [])
await database.write('previous-papers', [])
await database.write('exams', exams)

logger.info({
  event: 'seed.demo.completed',
  seededUsers: seededUsers.length,
  seededPurchases: demoPurchases.length,
}, 'MongoDB auth users, demo purchases, and JSON demo data seeded')
