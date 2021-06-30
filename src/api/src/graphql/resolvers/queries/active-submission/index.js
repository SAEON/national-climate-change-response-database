import logSql from '../../../../lib/log-sql.js'

export default async (self, { id }, ctx) => {
  const { query } = ctx.mssql

  const sql = `
    select
    *
    from WebSubmissions
    where id = '${id}'`

  logSql(sql, 'Load in-progress submission')
  const result = await query(sql)
  return result.recordset[0]
}
