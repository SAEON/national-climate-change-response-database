import DataLoader from 'dataloader'
import query from '../query.js'
import sift from 'sift'
import logSql from '../../lib/log-sql.js'

export default () =>
  new DataLoader(
    async keys => {
      const sql = `
        select distinct
        vt.id vtId,
        v.*
        from VocabularyXrefTree vt
        join Vocabulary v on v.id = vt.vocabularyId
        where vt.id in (${keys.join(',')})`

      logSql(sql, 'Find vocabulary')

      const result = await query(sql)

      return keys.map(id => result.recordset.filter(sift({ vtId: id })))
    },
    {
      batch: true,
      maxBatchSize: 250,
      cache: true,
    }
  )
