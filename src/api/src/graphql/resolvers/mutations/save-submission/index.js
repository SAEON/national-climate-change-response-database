import { pool } from '../../../../mssql/pool.js'

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
  const { user } = ctx
  const userId = user.info(ctx).id

  const request = (await pool.connect()).request()
  request
    .input('project', JSON.stringify(project))
    .input('mitigation', JSON.stringify(mitigation))
    .input('adaptation', JSON.stringify(adaptation))
    .input('userId', userId)
    .input('createdAt', new Date().toISOString())
    .input('submissionComments', submissionComments)
    .input('isSubmitted', isSubmitted)
    .input('submissionId', submissionId)

  if (submissionStatus) {
    request.input('submissionStatus', JSON.stringify(submissionStatus))
  }

  const sql = `
    merge Submissions t
    using (
      select
        @project project,
        @mitigation mitigation,
        @adaptation adaptation,
        @isSubmitted isSubmitted,
        ${submissionStatus ? `@submissionStatus submissionStatus,` : ''}
        @submissionComments submissionComments,
        @userId createdBy,
        @createdAt createdAt
    ) s on t.id = @submissionId
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

  const result = await request.query(sql)
  return result.recordset[0]
}
