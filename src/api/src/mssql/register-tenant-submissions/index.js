import { pool } from '../pool.js'
import mssql from 'mssql'
import mergeTenantsSubmissions from '../../lib/sql/merge-tenants-submissions.js'
import logger from '../../lib/logger.js'

export default async () => {
  logger.info(
    'Installed default tenant. Populating TenantXrefSubmission (asynchronously, you can use the app whilst this is in progress)'
  )

  const transaction = new mssql.Transaction(await pool.connect())
  await transaction.begin()
  try {
    // Get a list of tenants
    const tenants = (await transaction.request().query(`select id from Tenants;`)).recordset.map(
      ({ id }) => id
    )

    // For each tenant register all submissions
    for (const tenantId of tenants) {
      await transaction
        .request()
        .input('tenantId', tenantId)
        .input('submissionId', null)
        .query(mergeTenantsSubmissions)

      logger.info('Registered submissions for tenantId', tenantId)
    }

    await transaction.commit()
  } catch (error) {
    await transaction.rollback()
    throw new Error(`Transaction to populate TenantXrefSubmission table failed: ${error.message}`)
  }
}
