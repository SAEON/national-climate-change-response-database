import mergeTenantsSubmissions from '../../../../lib/sql/merge-tenants-submissions.js'
import mssql from 'mssql'
import logger from '../../../../lib/logger.js'

export default async (_, { id }, ctx) => {
  const { pool } = ctx.mssql

  const transaction = new mssql.Transaction(await pool.connect())
  await transaction.begin()

  try {
    await transaction.request().input('deletedAt', new Date().toISOString()).input('id', id).query(`
      update submissions
      set deletedAt = @deletedAt
      where id = @id`)

    await transaction
      .request()
      .input('tenantId', null)
      .input('submissionId', id)
      .query(mergeTenantsSubmissions)

    await transaction.commit()
  } catch (error) {
    logger.error('Error deleting tenants', id)
    await transaction.rollback()
    throw error
  }

  return id
}
