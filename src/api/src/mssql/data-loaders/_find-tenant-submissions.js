import DataLoader from 'dataloader'
import { pool } from '../pool.js'
import sift from 'sift'

export default (userId = undefined) => {
  return new DataLoader(
    async keys => {
      const request = (await pool.connect()).request()

      if (userId) {
        request.input('userId', userId)
      }

      keys.forEach((key, i) => request.input(`key_${i}`, key))

      const result = await request.query(`
        select
          x.tenantId,
          s.*
        from Submissions s
        join TenantXrefSubmission x on x.submissionId = s.id
        where
          deletedAt is null
          and x.tenantId in (${keys.map((_, i) => `@key_${i}`)})
          ${userId ? `and s.createdBy = @userId` : ''}`)

      return keys.map(tenantId => result.recordset.filter(sift({ tenantId })))
    },
    {
      batch: true,
      maxBatchSize: 250,
      cache: true,
    }
  )
}
