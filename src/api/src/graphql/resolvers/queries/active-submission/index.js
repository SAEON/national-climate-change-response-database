import logSql from '../../../../lib/log-sql.js'

export default async (self, { id }, ctx) => {
  const { query } = ctx.mssql

  const sql = `
    select *
    from ActiveSubmissions s
    where id = '${sanitizeSqlValue(id)}'`

  logSql(sql, 'Active submission', true)
  const result = await query(sql)
  return result.recordset[0]
}
