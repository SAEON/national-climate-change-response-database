import { pool } from '../../../../mssql/pool.js'

export default async (_, { id, isSubmitted = undefined }, ctx) => {
  const {
    tenant: { id: tenantId },
  } = ctx

  console.log('tenant ID (/submission:id)', tenantId)

  const request = (await pool.connect()).request()
  request.input('id', id)
  if (isSubmitted !== undefined) {
    request.input('isSubmitted', isSubmitted ? 1 : 0)
  }

  const result = await request.query(`
    select
      *
    from Submissions s
    where
      id = @id
      ${isSubmitted === undefined ? '' : 'and isSubmitted = @isSubmitted'}`)

  return result.recordset[0]
}
