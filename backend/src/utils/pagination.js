export function paginate(records, page = 1, limit = 20) {
  const safePage = Math.max(1, Number(page) || 1)
  const safeLimit = Math.min(100, Math.max(1, Number(limit) || 20))
  const start = (safePage - 1) * safeLimit
  return {
    items: records.slice(start, start + safeLimit),
    meta: {
      page: safePage,
      limit: safeLimit,
      total: records.length,
      totalPages: Math.ceil(records.length / safeLimit),
    },
  }
}
