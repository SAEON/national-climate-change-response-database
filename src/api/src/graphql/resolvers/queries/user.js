import logSql from '../../../lib/log-sql.js'

export default async (self, { id }, ctx) => {
  const { user, mssql, PERMISSIONS } = ctx
  const { query } = mssql

  if (!id === user.info(ctx).id) {
    console.log('User request', id, user.info(ctx).id)
    await user.ensurePermission({ ctx, permission: PERMISSIONS.viewUsers })
  }

  const sql = `
  select
  u.*
  from Users u
  where u.id = ${id}`

  logSql(sql, 'Find users')
  const result = await query(sql)
  return result.recordset[0]
}
