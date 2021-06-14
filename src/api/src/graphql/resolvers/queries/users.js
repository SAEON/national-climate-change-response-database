import logSql from '../../../lib/log-sql.js'

export default async (self, { ids = [] }, ctx) => {
  const { user, mssql, PERMISSIONS } = ctx
  const { query } = mssql

  await user.ensurePermission({ ctx, permission: PERMISSIONS.viewUsers })

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
