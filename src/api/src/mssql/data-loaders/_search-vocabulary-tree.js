import DataLoader from 'dataloader'
import { pool } from '../pool.js'
import sift from 'sift'
import logSql from '../../lib/log-sql.js'

export default () =>
  new DataLoader(
    async keys => {
      const trees = [...new Set(keys.map(({ tree }) => tree))]

      const ids = keys
        .map(({ ids }) => ids)
        .flat()
        .filter(_ => _)

      const request = (await pool.connect()).request()
      ids.forEach((id, i) => request.input(`id_${i}`, id))
      trees.forEach((tree, i) => request.input(`tree_${i}`, tree))

      const sql = `
        select
          p.id,
          p.term,
          p.tree,
          children.id id
        
        from (
          select
          parent.id,
          parent.term,
          t.id treeId,
          t.name tree
        
          from Vocabulary parent
          join VocabularyXrefTree vxt on vxt.vocabularyId = parent.id
          join Trees t on t.id = vxt.treeId
        
          where
            parent.id in (${ids.length ? ids.map((_, i) => `@id_${i}`).join(',') : null})
            and t.name in (${trees.length ? trees.map((_, i) => `@tree_${i}`).join(',') : null})
        ) p
        left outer join VocabularyXrefVocabulary vxv on vxv.parentId = p.id and vxv.treeId = p.treeId
        left outer join Vocabulary children on children.id = vxv.childId
        
        for json auto;`

      try {
        const results = await request.query(sql)
        const rows = results.recordset[0]

        /**
         * Return an array for each key
         * Each key should correspond to an
         * array of rows:
         *
         * [ [row1, row2, row3, row4, etc...] ]
         *
         * The DataLoader passes back the inner
         * array to the resolver:
         *
         * [row1, row2, row3, row4, etc...]
         */
        return keys.map(
          ({ tree, ids = [] }) =>
            rows?.filter(sift({ tree, id: { $in: ids.filter(_ => _) } })) || []
        )
      } catch (error) {
        logSql(sql, 'SQL ERROR', true)
      }
    },
    {
      batch: true,
      maxBatchSize: 250,
      cache: true,
    }
  )
