import logSql from '../../../../lib/log-sql.js'

export default async (self, args, ctx) => {
  const { query } = ctx.mssql

  const sql = `
    insert into Submissions (
      userId,
      createdBy,
      createdAt
    )

    output inserted.*
    
    values (
      ${ctx.user.info(ctx).id},
      ${ctx.user.info(ctx).id},
      '${new Date().toISOString()}'
    );`

  logSql(sql, 'Create submission')
  const result = await query(sql)
  return result.recordset[0]
}
