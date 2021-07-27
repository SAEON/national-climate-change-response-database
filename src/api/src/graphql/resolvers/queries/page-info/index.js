import logSql from '../../../../lib/log-sql.js'
import makeAggregationQuery from './_aggregation-query.js'
import { MAX_PAGE_SIZE } from '../submissions/index.js'

export default async (_, args, ctx) => {
  const { query } = ctx.mssql
  const { limit = MAX_PAGE_SIZE, offset = 0 } = args

  if (limit > MAX_PAGE_SIZE) {
    throw new Error(`Submissions request is limited to a maximum page size of ${MAX_PAGE_SIZE}`)
  }

  const sql = makeAggregationQuery(args)

  logSql(sql, 'Submissions (page info)')
  const result = await query(sql)
  const { submissionCount: totalRecords } = result.recordset[0]

  return {
    hasPreviousPage: offset > 0,
    hasNextPage: totalRecords > offset + limit,
    totalRecords,
  }
}
