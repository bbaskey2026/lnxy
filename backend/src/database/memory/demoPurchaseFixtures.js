import crypto from 'node:crypto'

export function createDemoPurchase(
  studentId,
  productId,
  productType,
  productName,
  amountMinor,
  mockTestType,
) {
  const id = crypto.randomUUID()
  const now = new Date()
  const item = { productId, productType, productName, quantity: 1, unitAmountMinor: amountMinor }
  if (mockTestType) item.mockTestType = mockTestType

  return {
    id,
    studentId,
    items: [item],
    currency: 'INR',
    subtotalAmountMinor: amountMinor,
    discountAmountMinor: 0,
    taxAmountMinor: 0,
    totalAmountMinor: amountMinor,
    status: 'paid',
    payment: {
      provider: 'demo',
      providerPaymentId: `demo-${id}`,
      method: 'test',
    },
    paidAt: now,
    createdAt: now,
    updatedAt: now,
  }
}

export function createDemoPurchaseRecords(studentId, courseId = 'demo-course-ssc-cgl-foundation') {
  return [
    createDemoPurchase(
      studentId,
      '00000000-0000-4000-8000-000000000101',
      'mocktest',
      'SSC CGL Tier I - Full Mock 01',
      9900,
      'full',
    ),
    createDemoPurchase(
      studentId,
      '00000000-0000-4000-8000-000000000102',
      'mocktest',
      'OSSSC RI - Arithmetic Sectional',
      4900,
      'sectional',
    ),
    createDemoPurchase(
      studentId,
      '00000000-0000-4000-8000-000000000103',
      'mocktest',
      'SSC CGL Quantitative Aptitude - Topic Test',
      2900,
      'topic',
    ),
    createDemoPurchase(
      studentId,
      courseId,
      'courses',
      'SSC CGL Complete Foundation',
      49900,
    ),
  ]
}
