import logSql from '../../../../lib/log-sql.js'

export default async (_, { id, isSubmitted = undefined }, ctx) => {
  const { query } = ctx.mssql

  const sql = `
    select *
    from Submissions s
    where 
    id = '${sanitizeSqlValue(id)}'
    ${isSubmitted === undefined ? '' : `and isSubmitted = ${isSubmitted ? 1 : 0}`};`

  logSql(sql, 'Submission', true)
  const result = await query(sql)
  return result.recordset[0]
}
