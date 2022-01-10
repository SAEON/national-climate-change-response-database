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
          ( select * from Tenants t where t.id = x.tenantId for json path, without_array_wrapper ) tenant,
          ( select * from Roles r where r.id = xr.id for json path) roles
        from UserXrefRoleXrefTenant x
        join Roles xr on xr.id = x.roleId
        where
          x.userId in (${keys.map((_, i) => `@key_${i}`)});`)

      return keys.map(userId => result.recordset.filter(sift({ userId })))
    },
    {
      batch: true,
      maxBatchSize: 250,
      cache: true,
    }
  )
