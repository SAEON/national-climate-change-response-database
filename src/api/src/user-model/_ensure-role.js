export default async (ctx, name) => {
  const { query } = ctx.mssql

  if (!ctx.userInfo) {
    ctx.throw(401)
    return
  }

  const { userInfo } = ctx
  const { id: userId } = userInfo

  const isAuthorized = Boolean(
    (
      await query(
        `select * from UserRoleXref where userId = ${userId} and roleId in (select id from Roles where name = '${name}');`
      )
    ).recordset.length
  )

  if (!isAuthorized) {
    ctx.throw(403)
  }
}
