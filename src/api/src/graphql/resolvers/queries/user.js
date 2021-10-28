import PERMISSIONS from '../../../user-model/permissions.js'
import mssql from 'mssql'

export default async (self, { id }, ctx) => {
  const { user } = ctx

  if (!id === ctx.user.info(ctx).id) {
    console.log('User request', id, user.info(ctx).id)
    await user.ensurePermission({ ctx, permission: PERMISSIONS['view-users'] })
  }

  const p = new mssql.PreparedStatement(await ctx.mssql.pool.connect())
  let result

  try {
    p.input('id', mssql.Int)
    await p.prepare(` select u.* from Users u where u.id = @id;`)
    result = await p.execute({ id })
  } catch (error) {
    console.error('query.user error', error)
  } finally {
    await p.unprepare()
  }

  if (result) {
    return result.recordset[0]
  }
}
