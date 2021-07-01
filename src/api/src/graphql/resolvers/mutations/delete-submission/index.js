import logSql from '../../../../lib/log-sql.js'
export default async (self, { id }, ctx) => {
  const { query } = ctx.mssql
  const sql = `delete from ActiveSubmissions where id = '${id}'`
  logSql(sql, 'Delete submission')
  await query(sql)
  return id
}
