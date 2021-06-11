import DataLoader from 'dataloader'
import query from '../query.js'
import sift from 'sift'
import logSql from '../../lib/log-sql.js'

export default () =>
  new DataLoader(
    async keys => {
      const sql = `
        select
          x.roleId,
          p.id,
          p.name,
          p.description
        from Permissions p
        join PermissionRoleXref x on x.permissionId = p.id
        where x.roleId in (${keys.join(',')})`

      logSql(sql, 'Find role permissions')
      const result = await query(sql)
      return keys.map(id => result.recordset.filter(sift({ roleId: id })))
    },
    {
      batch: true,
      maxBatchSize: 250,
      cache: true,
    }
  )
