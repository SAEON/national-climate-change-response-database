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
          x.userId,
          r.id,
          r.name,
          r.description
        from Roles r
        join UserRoleXref x on x.roleId = r.id
        where
          x.userId in (${keys.map((_, i) => `@key_${i}`)});`)

      return keys.map(id => result.recordset.filter(sift({ userId: id })))
    },
    {
      batch: true,
      maxBatchSize: 250,
      cache: true,
    }
  )
