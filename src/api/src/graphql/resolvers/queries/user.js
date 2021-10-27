import logSql from '../../../lib/log-sql.js'
import PERMISSIONS from '../../../user-model/permissions.js'

export default async (self, { id }, ctx) => {
  const { user, mssql } = ctx
  const { query } = mssql

  if (!id === user.info(ctx).id) {
    console.log('User request', id, user.info(ctx).id)
    await user.ensurePermission({ ctx, permission: PERMISSIONS['view-users'] })
  }

  const sql = `
  select
  u.*
  from Users u
  where u.id = ${id}`

  logSql(sql, 'User')
  const result = await query(sql)
  return result.recordset[0]
}
