import logSql from '../../../../lib/log-sql.js'

export default async (
  _,
  {
    submissionId,
    project,
    mitigation = {},
    adaptation = {},
    isSubmitted = false,
    submissionStatus = undefined,
    submissionComments = '',
  },
  ctx
) => {
  const { query } = ctx.mssql
  const { user } = ctx
  const userId = user.info(ctx).id

  const sql = `
    merge Submissions t
    using (
      select
        '${sanitizeSqlValue(JSON.stringify(project))}' project,
        '${sanitizeSqlValue(JSON.stringify(mitigation))}' mitigation,
        '${sanitizeSqlValue(JSON.stringify(adaptation))}' adaptation,
        ${isSubmitted ? 1 : 0} isSubmitted,
        ${
          submissionStatus
            ? `'${sanitizeSqlValue(JSON.stringify(submissionStatus))}' submissionStatus,`
            : ''
        }
        '${sanitizeSqlValue(submissionComments)}' submissionComments,
        ${userId} createdBy,
        '${new Date().toISOString()}' createdAt
    ) s on t.id = '${sanitizeSqlValue(submissionId)}'
    when not matched then insert (
      project,
      mitigation,
      adaptation,
      isSubmitted,
      ${submissionStatus ? 'submissionStatus,' : ''}
      submissionComments,
      createdBy,
      createdAt
    )
    values (
      s.project,
      s.mitigation,
      s.adaptation,
      s.isSubmitted,
      ${submissionStatus ? 's.submissionStatus,' : ''}
      submissionComments,
      s.createdBy,
      s.createdAt
    )
    when matched then update set
      t.project = s.project,
      t.mitigation = s.mitigation,
      t.adaptation = s.adaptation,
      t.isSubmitted = s.isSubmitted,
      ${submissionStatus ? 't.submissionStatus = s.submissionStatus,' : ''}
      t.submissionComments = s.submissionComments
      
    output
      $action,
      inserted.*;`

  logSql(sql, 'Save submission')
  const response = await query(sql)
  const output = response.recordset[0]
  return output
}
