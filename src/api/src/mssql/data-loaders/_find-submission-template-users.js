import DataLoader from 'dataloader'
import query from '../query.js'
import sift from 'sift'
import logSql from '../../lib/log-sql.js'

export default () =>
  new DataLoader(
    async keys => {
      const sql = `
        select u.*
        from ExcelSubmissionTemplates t
        join Users u on u.id = t.createdBy
        where t.createdBy in (${keys.join(',')})`

      logSql(sql, 'Find submission template owners')
      const result = await query(sql)
      return keys.map(id => result.recordset.filter(sift({ id })))
    },
    {
      batch: true,
      maxBatchSize: 250,
      cache: true,
    }
  )
