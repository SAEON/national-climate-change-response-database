import DataLoader from 'dataloader'
import query from '../query.js'
import sift from 'sift'
import logSql from '../../lib/log-sql.js'

export default () =>
  new DataLoader(
    async keys => {
      const sql = `
        select *
        from Projects p
        where p.userId in (${keys.join(',')})`

      logSql(sql, "Find user's projects", true)
      const result = await query(sql)
      return keys.map(userId => result.recordset.filter(sift({ userId })))
    },
    {
      batch: true,
      maxBatchSize: 250,
      cache: true,
    }
  )
