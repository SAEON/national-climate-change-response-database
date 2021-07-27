import DataLoader from 'dataloader'
import query from '../query.js'
import sift from 'sift'
import logSql from '../../lib/log-sql.js'

export default () =>
  new DataLoader(
    async keys => {
      const sql = `
        select
          x.userId,
          p.id,
          p.name,
          p.description
        from Roles r
        join UserRoleXref x on x.roleId = r.id
        join PermissionRoleXref px on px.roleId = r.id
        join Permissions p on p.id = px.permissionId
        where x.userId in (${keys.join(',')})`

      logSql(sql, 'User permissions (batched)')
      const result = await query(sql)
      return keys.map(id => result.recordset.filter(sift({ userId: id })))
    },
    {
      batch: true,
      maxBatchSize: 250,
      cache: true,
    }
  )
