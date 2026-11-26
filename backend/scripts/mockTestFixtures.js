const questionIds = [
  '00000000-0000-4000-8000-000000000001',
  '00000000-0000-4000-8000-000000000002',
  '00000000-0000-4000-8000-000000000003',
  '00000000-0000-4000-8000-000000000004',
  '00000000-0000-4000-8000-000000000005',
  '00000000-0000-4000-8000-000000000006',
  '00000000-0000-4000-8000-000000000007',
  '00000000-0000-4000-8000-000000000008',
]

const mockTestIds = [
  '00000000-0000-4000-8000-000000000101',
  '00000000-0000-4000-8000-000000000102',
  '00000000-0000-4000-8000-000000000103',
]

export function createMockTestFixtures(exams) {
  const sscExam = exams.find((exam) => exam.slug === 'ssc-cgl' || exam.name === 'SSC CGL')
  const ossscExam = exams.find((exam) => exam.slug === 'osssc-ri' || exam.name === 'OSSSC RI')
  if (!sscExam || !ossscExam) throw new Error('SSC CGL and OSSSC RI exams are required to seed mock tests.')

  const now = new Date().toISOString()
  const questions = [
    {
      id: questionIds[0],
      examId: sscExam.id,
      subject: 'Quantitative Aptitude',
      text: 'A and B together can complete a work in 12 days. A alone can complete it in 20 days. In how many days can B alone complete it?',
      options: ['25 days', '30 days', '35 days', '40 days'],
      correctOptionIndex: 1,
      explanation: 'Let B take x days. 1/20 + 1/x = 1/12. Solving gives 1/x = 1/30, so B takes 30 days.',
    },
    {
      id: questionIds[1],
      examId: sscExam.id,
      subject: 'Reasoning',
      text: 'Find the odd one out.',
      options: ['Square', 'Rectangle', 'Triangle', 'Cube'],
      correctOptionIndex: 3,
      explanation: 'Square, rectangle and triangle are two-dimensional figures, while cube is three-dimensional.',
    },
    {
      id: questionIds[2],
      examId: sscExam.id,
      subject: 'English',
      text: 'Choose the word closest in meaning to "Meticulous".',
      options: ['Careless', 'Precise', 'Rapid', 'Ordinary'],
      correctOptionIndex: 1,
      explanation: 'Meticulous means showing great attention to detail, making "precise" the closest meaning.',
    },
    {
      id: questionIds[3],
      examId: sscExam.id,
      subject: 'General Studies',
      text: 'Which Article of the Indian Constitution deals with the abolition of untouchability?',
      options: ['Article 14', 'Article 17', 'Article 21', 'Article 32'],
      correctOptionIndex: 1,
      explanation: 'Article 17 abolishes untouchability and forbids its practice in any form.',
    },
    {
      id: questionIds[4],
      examId: sscExam.id,
      subject: 'Quantitative Aptitude',
      text: 'A shopkeeper marks an article 25% above cost price and allows a 10% discount. What is the profit percentage?',
      options: ['12.5%', '15%', '17.5%', '20%'],
      correctOptionIndex: 0,
      explanation: 'Let cost be 100. Marked price is 125 and selling price is 112.5, resulting in 12.5% profit.',
    },
    {
      id: questionIds[5],
      examId: sscExam.id,
      subject: 'Reasoning',
      text: 'If FLOWER is written as 612753, then what could be the code for WOLF?',
      options: ['3526', '3625', '2563', '6253'],
      correctOptionIndex: 2,
      explanation: 'This uses the letter-position mapping established by the given sample code; the resulting sequence for WOLF is 2563.',
    },
    {
      id: questionIds[6],
      examId: ossscExam.id,
      subject: 'Arithmetic',
      text: 'The average of five consecutive even numbers is 28. What is the largest number?',
      options: ['30', '32', '34', '36'],
      correctOptionIndex: 1,
      explanation: 'The middle number is 28. The numbers are 24, 26, 28, 30 and 32, so the largest is 32.',
    },
    {
      id: questionIds[7],
      examId: ossscExam.id,
      subject: 'Arithmetic',
      text: 'A sum doubles itself in 10 years at simple interest. What is the rate?',
      options: ['8%', '10%', '12%', '15%'],
      correctOptionIndex: 1,
      explanation: 'For doubling, interest equals principal. R = 100/P years = 100/10 = 10%.',
    },
  ].map((question) => ({
    ...question,
    type: 'MCQ',
    difficulty: 'Medium',
    solutionSteps: [],
    isPreviousYear: false,
    year: null,
    createdAt: now,
    updatedAt: now,
  }))

  const mockTests = [
    {
      id: mockTestIds[0],
      examId: sscExam.id,
      title: 'SSC CGL Tier I - Full Mock 01',
      mockTestType: 'full',
      category: 'Full-length',
      durationSeconds: 3600,
      positiveMarks: 2,
      negativeMarks: 0.5,
      questionIds: questionIds.slice(0, 6),
      isActive: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: mockTestIds[1],
      examId: ossscExam.id,
      title: 'OSSSC RI - Arithmetic Sectional',
      mockTestType: 'sectional',
      category: 'Sectional',
      durationSeconds: 1800,
      positiveMarks: 1,
      negativeMarks: 0.25,
      questionIds: questionIds.slice(6),
      isActive: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: mockTestIds[2],
      examId: sscExam.id,
      title: 'SSC CGL Quantitative Aptitude - Topic Test',
      mockTestType: 'topic',
      category: 'Topic-based',
      durationSeconds: 900,
      positiveMarks: 2,
      negativeMarks: 0.5,
      questionIds: [questionIds[0], questionIds[4]],
      isActive: true,
      createdAt: now,
      updatedAt: now,
    },
  ]

  return { questions, mockTests }
}
