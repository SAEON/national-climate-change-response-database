import { unlink } from 'fs'
import mssql from 'mssql'
import logger from '../../../../lib/logger.js'

export default async (_, { ids, submissionId }, ctx) => {
  const { pool } = ctx.mssql
  const successfulDeletes = []

  /**
   * Validate that tenant is not spoofed
   */
  if (
    !(
      await (await pool.connect()).request().input('submissionId', submissionId).query(`
        select
          tenantId
        from TenantXrefSubmission
        where submissionId = @submissionId;`)
    ).recordset
      .map(({ tenantId }) => tenantId)
      .includes(ctx.tenant.id)
  ) {
    throw new Error('Invalid tenant specified in origin header')
  }

  for (const id of ids) {
    const transaction = new mssql.Transaction(await pool.connect())
    try {
      await transaction.begin()
      const filePath = (
        await transaction.request().input('submissionId', submissionId).input('id', id).query(`
          select
            *
          from WebSubmissionFiles
          where
            webSubmissionId = @submissionId
            and id = @id;`)
      ).recordset[0].filePath

      // Unlink the file
      await new Promise((resolve, reject) =>
        unlink(filePath, error => (error ? reject(error) : resolve()))
      )

      // Once the file is unlinked, delete the database entry
      await transaction.request().input('submissionId', submissionId).input('id', id).query(`
        delete from WebSubmissionFiles
        where
          webSubmissionId = @submissionId
          and id = @id;`)

      successfulDeletes.push(id)

      transaction.commit()
    } catch (error) {
      logger.error('Error removing attachment', id, error)
      await transaction.rollback()
      transaction.rollback()
    }
  }

  return { ids: successfulDeletes }
}
