import logSql from '../../../../lib/log-sql.js'
import makeRecordsQuery from './_records-query.js'

const MAX_PAGE_SIZE = 25

export default async (_, args, ctx) => {
  const { query } = ctx.mssql
  const { limit } = args

  if (limit > MAX_PAGE_SIZE) {
    throw new Error(`Submissions request is limited to a maximum page size of ${MAX_PAGE_SIZE}`)
  }

  const sql = makeRecordsQuery(MAX_PAGE_SIZE)(args)
  logSql(sql, 'Submissions')
  const result = await query(sql)
  return result.recordset
}
