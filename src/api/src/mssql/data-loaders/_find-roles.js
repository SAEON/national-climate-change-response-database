import DataLoader from 'dataloader'
import { pool } from '../pool.js'
import sift from 'sift'

export default () =>
  new DataLoader(
    async ids => {
      const _pool = await pool.connect()
      const request = _pool.request()
      ids.forEach((key, i) => request.input(`key_${i}`, key))

      const result = await request.query(`
        select *
        from roles r
        where
          r.id in (${ids.map((_, i) => `@key_${i}`)});`)

      return ids.map(id => result.recordset.filter(sift({ id })))
    },
    {
      batch: true,
      maxBatchSize: 250,
      cache: true,
    }
  )
