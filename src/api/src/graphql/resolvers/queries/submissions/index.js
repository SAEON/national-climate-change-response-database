import logSql from '../../../../lib/log-sql.js'
import makeRecordsQuery from './_records-query.js'
import { pool } from '../../../../mssql/pool.js'

export const MAX_PAGE_SIZE = 25

export default async (_, args, ctx) => {
  const {
    tenant: { id: tenantId },
  } = ctx

  const { limit = MAX_PAGE_SIZE } = args

  if (limit > MAX_PAGE_SIZE) {
    throw new Error(`Submissions request is limited to a maximum page size of ${MAX_PAGE_SIZE}`)
  }

  const request = (await pool.connect()).request()
  const sql = await makeRecordsQuery(MAX_PAGE_SIZE)(ctx, { request, tenantId, ...args })
  logSql(sql, 'Submissions')
  return (await request.query(sql)).recordset
}
