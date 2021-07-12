import logSql from '../../../../lib/log-sql.js'
import makeRecordsQuery from './_records-query.js'
import makeAggregationQuery from './_aggregation-query.js'

const MAX_PAGE_SIZE = 25

export default async (_, args, ctx) => {
  const { query } = ctx.mssql
  const { limit, offset } = args

  if (limit > MAX_PAGE_SIZE) {
    throw new Error(`Submissions request is limited to a maximum page size of ${MAX_PAGE_SIZE}`)
  }

  const baseSql = makeRecordsQuery(MAX_PAGE_SIZE)(args)
  const dataQuery = makeAggregationQuery(args)
  const sql = `${baseSql}${dataQuery}`

  logSql(sql, 'Submissions')
  const result = await query(sql)
  const [records, aggregationResult] = result.recordsets
  const { submissionCount: totalRecords } = aggregationResult[0]

  const pageInfo = {
    hasPreviousPage: offset > 0,
    hasNextPage: totalRecords > offset + limit,
    totalRecords,
  }

  return {
    pageInfo,
    records,
  }
}
