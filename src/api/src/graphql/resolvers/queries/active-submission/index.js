import logSql from '../../../../lib/log-sql.js'

export default async (self, { id }, ctx) => {
  const { query } = ctx.mssql

  const sql = `
    select
      s.*,
      (
        select
          id,
          name
        from WebSubmissionFiles f
        where webSubmissionId = s.id
        for json path
      ) fileUploads
    from
    WebSubmissions s
    where id = '${sanitizeSqlValue(id)}'`

  logSql(sql, 'Load in-progress submission', true)
  const result = await query(sql)
  return result.recordset[0]
}
