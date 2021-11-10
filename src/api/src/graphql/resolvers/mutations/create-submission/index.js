import { pool } from '../../../../mssql/pool.js'

export default async (self, args, ctx) => {
  return await (
    await (await pool.connect())
      .request()
      .input('id', ctx.user.info(ctx).id)
      .input('createdAt', new Date().toISOString()).query(`
      insert into Submissions (userId, createdBy, createdAt)
      output inserted.*
      values ( @id, @id, @createdAt );`)
  ).recordset[0]
}
