import logSql from '../../../../lib/log-sql.js'
import makeAggregationQuery from './_aggregation-query.js'

export default async (_, args, ctx) => {
  const { query } = ctx.mssql
  const { limit, offset } = args

  const sql = makeAggregationQuery(args)

  logSql(sql, 'Page info')
  const result = await query(sql)
  const { submissionCount: totalRecords } = result.recordset[0]

  return {
    hasPreviousPage: offset > 0,
    hasNextPage: totalRecords > offset + limit,
    totalRecords,
  }
}
