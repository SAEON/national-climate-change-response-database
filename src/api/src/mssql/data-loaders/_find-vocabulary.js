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
        where
          vt.id in (${keys.map((_, i) => `@key_${i}`)});`)

      return keys.map(id => result.recordset.filter(sift({ vtId: id })))
    },
    {
      batch: true,
      maxBatchSize: 250,
      cache: true,
    }
  )
