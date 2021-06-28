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
        t.name tree,
        v.*,
        (
          select p.term
          from VocabularyXrefVocabulary vxv
          join Vocabulary p on
            p.id = vxv.parentId
            and vxv.childId = v.id
            and vxv.treeId = t.id
        ) root
        from VocabularyXrefTree vt
        join Vocabulary v on v.id = vt.vocabularyId
        join Trees t on t.id = vt.treeId
        where vt.id in (${keys.join(',')})`

      logSql(sql, 'Find vocabulary', true)

      const result = await query(sql)

      return keys.map(id => result.recordset.filter(sift({ vtId: id })))
    },
    {
      batch: true,
      maxBatchSize: 250,
      cache: true,
    }
  )
