import DataLoader from 'dataloader'
import query from '../query.js'
import sift from 'sift'
import logSql from '../../lib/log-sql.js'

export default () =>
  new DataLoader(
    async keys => {
      const sql = `
        select *
        from Submissions s
        where s.createdBy in (${keys.join(',')})`

      logSql(sql, "Find user's submissions", true)
      const result = await query(sql)
      return keys.map(createdBy => result.recordset.filter(sift({ createdBy })))
    },
    {
      batch: true,
      maxBatchSize: 250,
      cache: true,
    }
  )
