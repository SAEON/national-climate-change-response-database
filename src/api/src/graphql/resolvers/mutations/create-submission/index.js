import mssql from 'mssql'
import mergeTenantsSubmissions from '../../../../lib/sql/merge-tenants-submissions.js'

export default async (self, args, ctx) => {
  const { pool } = ctx.mssql
  const transaction = new mssql.Transaction(await pool.connect())
  await transaction.begin()

  try {
    const result = await transaction
      .request()
      .input('id', ctx.user.info(ctx).id)
      .input('createdAt', new Date().toISOString()).query(`
        insert into Submissions (userId, createdBy, createdAt)
        output inserted.*
        values (@id, @id, @createdAt);`)

    const submission = result.recordset[0]

    // Update submission-tenant matrix
    await transaction
      .request()
      .input('isSubmitted', null)
      .input('tenantId', null) // This save can effect other tenants, so don't limit to this tenant
      .input('submissionId', submission.id)
      .query(mergeTenantsSubmissions)

    await transaction.commit()

    return submission
  } catch (error) {
    console.error('Unable to create submission', error)
    throw error
  }
}
