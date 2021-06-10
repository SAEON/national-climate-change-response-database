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
          r.id,
          r.name,
          r.description
        from Roles r
        join UserRoleXref x on x.roleId = r.id
        where x.userId in (${keys.join(',')})`

      logSql(sql, 'Find user roles')
      const result = await query(sql)
      return keys.map(id => result.recordset.filter(sift({ userId: id })))
    },
    {
      batch: true,
      maxBatchSize: 250,
      cache: true,
    }
  )
