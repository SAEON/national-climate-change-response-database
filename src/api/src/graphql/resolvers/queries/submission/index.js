import { pool } from '../../../../mssql/pool.js'

export default async (_, { id, isSubmitted = undefined }, ctx) => {
  const {
    tenant: { id: tenantId },
  } = ctx

  const request = (await pool.connect()).request()
  request.input('id', id)
  request.input('tenantId', tenantId)
  if (isSubmitted !== undefined) {
    request.input('isSubmitted', isSubmitted ? 1 : 0)
  }

  return (
    await request.query(`
    select
      *
    from Submissions s
    where
      exists ( select tenantId from TenantXrefSubmission x where x.tenantId = @tenantId and x.submissionId = @id )
      and id = @id
      ${isSubmitted === undefined ? '' : 'and isSubmitted = @isSubmitted'}`)
  ).recordset[0]
}
