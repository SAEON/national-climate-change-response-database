import logSql from '../../../../lib/log-sql.js'

export default async (self, args, ctx) => {
  const { query } = ctx.mssql

  const sql = `
    insert into WebSubmissions (
      createdBy,
      createdAt
    )

    output inserted.id
    
    values (
      ${ctx.user.info(ctx).id},
      '${new Date().toISOString()}'
    );`

  logSql(sql, 'Create submission')
  const result = await query(sql)
  return result.recordset[0].id
}
