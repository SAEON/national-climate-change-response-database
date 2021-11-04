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
          u.*
        from ExcelSubmissionTemplates t
        join Users u on u.id = t.createdBy
        where
          t.createdBy in (${keys.map((_, i) => `@key_${i}`)});`)

      return keys.map(id => result.recordset.filter(sift({ id })))
    },
    {
      batch: true,
      maxBatchSize: 250,
      cache: true,
    }
  )
