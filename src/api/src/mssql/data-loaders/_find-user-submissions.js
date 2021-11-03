import DataLoader from 'dataloader'
import { pool } from '../pool.js'
import sift from 'sift'

export default () =>
  new DataLoader(
    async keys => {
      const _pool = await pool.connect()
      const request = _pool.request()
      keys.forEach((key, i) => request.input(`key_${i}`, key))

      const result = await request.query(`
        select
          *
        from Submissions s
        where
          deletedAt is null
          and s.createdBy in (${keys.map((_, i) => `@key_${i}`)})`)

      return keys.map(createdBy => result.recordset.filter(sift({ createdBy })))
    },
    {
      batch: true,
      maxBatchSize: 250,
      cache: true,
    }
  )
