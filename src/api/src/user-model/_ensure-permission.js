import logSql from '../lib/log-sql.js'

export default async (ctx, ...permissions) => {
  const { query } = ctx.mssql

  if (!ctx.userInfo) {
    ctx.throw(401)
    return
  }

  const { userInfo } = ctx
  const { id: userId } = userInfo

  const sql = `
    select
    1
    from Permissions p
    join PermissionRoleXref xp on xp.permissionId = p.id
    join UserRoleXref xu on xu.roleId = xp.roleId
    join Users u on u.id = xu.userId
    where userId = ${userId}
    and p.name in (${permissions.map(name => `'${sanitizeSqlValue(name)}'`).join(',')});`

  logSql(sql, 'Check user permissions')
  const result = await query(sql)
  const isAuthorized = Boolean(result.recordset.length)

  if (!isAuthorized) {
    ctx.throw(403)
  }
}
