import { pool } from '../mssql/pool.js'

export default async (ctx, validTenants, ...permissions) => {
  if (!ctx.userInfo) {
    ctx.throw(401)
    return
  }

  if (!ctx.tenant) {
    throw new Error('Authorization must be in the context of a tenant')
  }

  if (validTenants && !validTenants.includes(ctx.tenant.id)) {
    throw new Error(
      'The tenant specified in the HTTP origin header is not valid for the specified operation'
    )
  }

  const { userInfo } = ctx
  const { id: userId } = userInfo

  try {
    const request = (await pool.connect()).request()
    request.input('userId', userId)
    request.input('tenantId', ctx.tenant.id)
    permissions.forEach(({ name }, i) => request.input(`p_${i}`, name))
    const result = await request.query(`
      select 1
      from Permissions p
      join PermissionXrefRole xp on xp.permissionId = p.id
      join UserXrefRoleXrefTenant xu on xu.roleId = xp.roleId and xu.tenantId = @tenantId
      join Users u on u.id = xu.userId
      where
        userId = @userId
        and p.name in (${permissions.map((p, i) => `@p_${i}`).join(',')});`)

    const isAuthorized = Boolean(result.recordset.length)

    if (!isAuthorized) {
      ctx.throw(403)
    }
  } catch (error) {
    console.error('Error (ensurePermission)', error.message)
  }
}
