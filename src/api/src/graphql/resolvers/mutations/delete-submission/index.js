import logSql from '../../../../lib/log-sql.js'

export default async (_, { id }, ctx) => {
  const { query } = ctx.mssql
  const sql = `
    update Submissions
    set deletedAt = '${new Date().toISOString()}'
    where id = '${sanitizeSqlValue(id)}'`

  logSql(sql, 'Delete submission')
  await query(sql)
  return id
}
