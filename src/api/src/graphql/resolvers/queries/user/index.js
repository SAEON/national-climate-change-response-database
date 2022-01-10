import PERMISSIONS from '../../../../user-model/permissions.js'

export default async (_, { id }, ctx) => {
  const { pool } = ctx.mssql
  const { user } = ctx

  if (!id === ctx.user.info(ctx).id) {
    await user.ensurePermission({ ctx, permission: PERMISSIONS['view-users'] })
  }

  const users = await (await pool.connect())
    .request()
    .input('id', id)
    .query('select u.* from Users u where u.id = @id')

  return await users.recordset[0]
}
