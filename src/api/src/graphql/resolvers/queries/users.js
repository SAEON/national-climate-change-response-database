import logSql from '../../../lib/log-sql.js'

export default async (self, { ids = [] }, ctx) => {
  await ctx.user.ensureAdmin(ctx)
  const { query } = ctx.mssql

  const sql = `
  select
  u.*
  from Users u
  ${
    ids.length
      ? `
        where 
        u.id in (${ids.join(',')})`
      : ''
  }`

  logSql(sql, 'Find users')
  const result = await query(sql)
  return result.recordset
}
