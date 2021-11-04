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
          x.roleId,
          p.id,
          p.name,
          p.description
        from Permissions p
        join PermissionRoleXref x on x.permissionId = p.id
        where
          x.roleId in (${keys.map((_, i) => `@key_${i}`)});`)

      return keys.map(id => result.recordset.filter(sift({ roleId: id })))
    },
    {
      batch: true,
      maxBatchSize: 250,
      cache: true,
    }
  )
