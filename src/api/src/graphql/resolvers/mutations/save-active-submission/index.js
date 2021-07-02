import logSql from '../../../../lib/log-sql.js'

export default async (self, { submissionId, projectForm, mitigationForm, adaptationForm }, ctx) => {
  const { query } = ctx.mssql
  const { user } = ctx
  const userId = user.info(ctx).id

  const sql = `
    merge Submissions t
    using (
      select
        '${JSON.stringify(projectForm)}' projectForm,
        '${JSON.stringify(mitigationForm)}' mitigationForm,
        '${JSON.stringify(adaptationForm)}' adaptationForm,
        ${userId} createdBy,
        '${new Date().toISOString()}' createdAt
    ) s on t.id = '${sanitizeSqlValue(submissionId)}'
    when not matched then insert (
      projectForm,
      mitigationForm,
      adaptationForm,
      createdBy,
      createdAt
    )
    values (
      s.projectForm,
      s.mitigationForm,
      s.adaptationForm,
      s.createdBy,
      s.createdAt
    )
    when matched then update set
      t.projectForm = s.projectForm,
      t.mitigationForm = s.mitigationForm,
      t.adaptationForm = s.adaptationForm;`

  logSql(sql, 'Save active submission', true)
  await query(sql)

  return {
    id: 1,
    fileUploads: [],
  }
}
