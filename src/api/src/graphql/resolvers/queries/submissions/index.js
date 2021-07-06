import logSql from '../../../../lib/log-sql.js'

const MAX_PAGE_SIZE = 20

export default async (
  _,
  {
    isSubmitted = true,
    ids = [],
    vocabularyFilters = [],
    mitigationFilters: { vocabularyFilters: mitigationVocabularyFilters = [] } = {},
    adaptationFilters: { vocabularyFilters: adaptationVocabularyFilters = [] } = {},
    limit = MAX_PAGE_SIZE,
    offset = 0,
  },
  ctx
) => {
  const { query } = ctx.mssql

  if (limit > MAX_PAGE_SIZE) {
    throw new Error(`Projects request is limited to a maximum page size of ${MAX_PAGE_SIZE}`)
  }

  const sql = `
    select
    *
    from Submissions
    where
      deletedAt is null
      and isSubmitted = ${isSubmitted ? 1 : 0}
    order by id asc
    offset ${offset} rows
    fetch next ${limit} rows only`

  logSql(sql, 'Fetch projects', true)
  const result = await query(sql)
  return result.recordset
}
