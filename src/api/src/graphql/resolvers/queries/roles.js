export default async (self, args, ctx) => {
  const { user, mssql, PERMISSIONS } = ctx
  const { query } = mssql

  await user.ensurePermission({ ctx, permission: PERMISSIONS.viewRoles })

  const result = await query('select * from [Roles]')
  return result.recordset
}
