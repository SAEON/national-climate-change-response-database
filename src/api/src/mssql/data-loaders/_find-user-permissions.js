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
          p.id,
          p.name,
          p.description
        from Roles r
        join UserRoleXref x on x.roleId = r.id
        join PermissionRoleXref px on px.roleId = r.id
        join Permissions p on p.id = px.permissionId
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
