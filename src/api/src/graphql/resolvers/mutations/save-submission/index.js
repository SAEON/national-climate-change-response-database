import logSql from '../../../../lib/log-sql.js'

export default async (
  self,
  { submissionId, project, mitigation = {}, adaptation = {}, isSubmitted = false },
  ctx
) => {
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
        '${isSubmitted}' isSubmitted,
        ${userId} createdBy,
        '${new Date().toISOString()}' createdAt
    ) s on t.id = '${sanitizeSqlValue(submissionId)}'
    when not matched then insert (
      project,
      mitigation,
      adaptation,
      isSubmitted,
      createdBy,
      createdAt
    )
    values (
      s.project,
      s.mitigation,
      s.adaptation,
      s.isSubmitted,
      s.createdBy,
      s.createdAt
    )
    when matched then update set
      t.project = s.project,
      t.mitigation = s.mitigation,
      t.adaptation = s.adaptation,
      t.isSubmitted = s.isSubmitted;`

  logSql(sql, 'Save active submission', true)
  const result = await query(sql)

  // TODO - should return the whole document

  return {
    id: submissionId,
  }
}
