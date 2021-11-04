import PERMISSIONS from '../../../user-model/permissions.js'
import { pool } from '../../../mssql/pool.js'

export default async (_, { id }, ctx) => {
  const { user } = ctx

  if (!id === ctx.user.info(ctx).id) {
    await user.ensurePermission({ ctx, permission: PERMISSIONS['view-users'] })
  }

  return await (
    await (await pool.connect())
      .request()
      .input('id', id)
      .query('select u.* from Users u where u.id = @id')
  ).recordset[0]
}
