import mssql from 'mssql'

export default async (ctx, ...permissions) => {
  if (!ctx.userInfo) {
    ctx.throw(401)
    return
  }

  const { userInfo } = ctx
  const { id: userId } = userInfo

  const p = new mssql.PreparedStatement(await ctx.mssql.pool.connect())

  try {
    p.input('userId', mssql.Int)
    permissions.forEach((_p, i) => p.input(`p_${i}`, mssql.NVarChar))

    await p.prepare(`
      select
      1
      from Permissions p
      join PermissionRoleXref xp on xp.permissionId = p.id
      join UserRoleXref xu on xu.roleId = xp.roleId
      join Users u on u.id = xu.userId
      where
        userId = @userId
        and p.name in (${permissions.map((p, i) => `@p_${i}`).join(',')});`)

    const result = await p.execute({
      userId,
      ...Object.fromEntries(permissions.map(({ name }, i) => [`p_${i}`, name])),
    })

    const isAuthorized = Boolean(result.recordset.length)

    if (!isAuthorized) {
      ctx.throw(403)
    }
  } catch (error) {
    console.error('Error executing prepared statement (ensurePermission)', error.message)
  } finally {
    await p.unprepare()
  }
}
