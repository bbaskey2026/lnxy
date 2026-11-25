import test from 'node:test'
import assert from 'node:assert/strict'
import { MockTestService } from '../../src/services/MockTestService.js'

const mockTest = {
  id: '00000000-0000-4000-8000-000000000101',
  examId: '00000000-0000-4000-8000-000000000201',
  title: 'SSC CGL mock',
  category: 'Full-length',
  durationSeconds: 3600,
  positiveMarks: 2,
  negativeMarks: 0.5,
  questionIds: ['00000000-0000-4000-8000-000000000001'],
  isActive: true,
}

const question = {
  id: mockTest.questionIds[0],
  subject: 'Reasoning',
  text: 'Choose the answer.',
  options: ['A', 'B'],
  correctOptionIndex: 1,
  explanation: 'Option B is correct.',
}

function createService(tests = [mockTest]) {
  return new MockTestService(
    {
      findAll: async () => tests,
      findById: async (id) => tests.find((testRecord) => testRecord.id === id) ?? null,
    },
    { findAll: async () => [question] },
    { findAll: async () => [{ id: mockTest.examId, name: 'SSC CGL' }] },
  )
}

test('lists active mock tests as summaries with their question counts', async () => {
  const service = createService([mockTest, { ...mockTest, id: 'inactive', isActive: false }])

  const tests = await service.list()

  assert.equal(tests.length, 1)
  assert.equal(tests[0].examination, 'SSC CGL')
  assert.equal(tests[0].questionCount, 1)
  assert.equal('questions' in tests[0], false)
})

test('returns test questions with the format consumed by the test page', async () => {
  const testRecord = await createService().getById(mockTest.id)

  assert.deepEqual(testRecord.questions, [{
    id: question.id,
    subject: 'Reasoning',
    text: 'Choose the answer.',
    options: ['A', 'B'],
    correctIndex: 1,
    explanation: 'Option B is correct.',
  }])
})
