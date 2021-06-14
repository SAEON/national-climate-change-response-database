export default async (self, args, ctx) => {
  const { user, mssql, PERMISSIONS } = ctx
  const { query } = mssql

  await user.ensurePermission({ ctx, permission: PERMISSIONS.viewPermissions })

  const result = await query('select * from [Permissions]')
  return result.recordset
}
