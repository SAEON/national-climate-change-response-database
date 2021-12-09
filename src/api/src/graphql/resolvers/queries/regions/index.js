export default async (_, { terms, simplify = true }, ctx) => {
  const { pool } = ctx.mssql

  if (!simplify) {
    throw new Error('Not implemented (simplify = false)')
  }

  if (!terms.length) {
    return []
  }

  terms = [...new Set(terms)]

  const request = (await pool.connect()).request()
  terms.forEach((term, i) => request.input(`term_${i}`, term))

  const result = await request.query(`
    select
      r.id,
      v.term,
      r.[geometry].Reduce(0.005).STAsText() [geometry]
    from Vocabulary v
    join VocabularyXrefRegion x on x.vocabularyId = v.id
    join Regions r on r.id = x.regionId
    where v.term in (${terms.map((_, i) => `@term_${i}`).join(',')});`)

  return result.recordset
}
