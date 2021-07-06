import logSql from '../../../../lib/log-sql.js'

export default async (
  _,
  {
    submissionId,
    project,
    mitigation = {},
    adaptation = {},
    isSubmitted = false,
    validationStatus = undefined,
    validationComments = '',
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
        '${JSON.stringify(project)}' project,
        '${JSON.stringify(mitigation)}' mitigation,
        '${JSON.stringify(adaptation)}' adaptation,
        ${isSubmitted ? 1 : 0} isSubmitted,
        ${validationStatus ? `'${JSON.stringify(validationStatus)}' validationStatus,` : ''}
        '${sanitizeSqlValue(validationComments)}' validationComments,
        ${userId} createdBy,
        '${new Date().toISOString()}' createdAt
    ) s on t.id = '${sanitizeSqlValue(submissionId)}'
    when not matched then insert (
      project,
      mitigation,
      adaptation,
      isSubmitted,
      ${validationStatus ? 'validationStatus,' : ''}
      validationComments,
      createdBy,
      createdAt
    )
    values (
      s.project,
      s.mitigation,
      s.adaptation,
      s.isSubmitted,
      ${validationStatus ? 's.validationStatus,' : ''}
      validationComments,
      s.createdBy,
      s.createdAt
    )
    when matched then update set
      t.project = s.project,
      t.mitigation = s.mitigation,
      t.adaptation = s.adaptation,
      t.isSubmitted = s.isSubmitted,
      ${validationStatus ? 't.validationStatus = s.validationStatus,' : ''}
      t.validationComments = s.validationComments
      
    output
      $action,
      inserted.*,
      deleted.*;`

  logSql(sql, 'Save active submission', true)

  // TODO - should probably process the output and return that
  // eslint-disable-next-line
  const result = await query(sql)
  return {
    id: submissionId,
  }
}
