import logSql from '../../../../lib/log-sql.js'

export default async (self, { submissionId, project, mitigation, adaptation }, ctx) => {
  const { query } = ctx.mssql
  const { user } = ctx
  const userId = user.info(ctx).id

  const sql = `
    merge Submissions t
    using (
      select
        '${JSON.stringify(project)}' project,
        '${JSON.stringify(mitigation)}' mitigation,
        '${JSON.stringify(adaptation)}' adaptation,
        ${userId} createdBy,
        '${new Date().toISOString()}' createdAt
    ) s on t.id = '${sanitizeSqlValue(submissionId)}'
    when not matched then insert (
      project,
      mitigation,
      adaptation,
      createdBy,
      createdAt
    )
    values (
      s.project,
      s.mitigation,
      s.adaptation,
      s.createdBy,
      s.createdAt
    )
    when matched then update set
      t.project = s.project,
      t.mitigation = s.mitigation,
      t.adaptation = s.adaptation;`

  logSql(sql, 'Save active submission', true)
  await query(sql)

  return {
    id: 1,
    fileUploads: [],
  }
}
