import DataLoader from 'dataloader'
import query from '../query.js'
import sift from 'sift'
import logSql from '../../lib/log-sql.js'

export default () =>
  new DataLoader(
    async keys => {
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
          join VocabularyTrees t on t.id = vxt.vocabularyTreeId
        
          where
          parent.id in (${
            keys
              .map(({ ids }) => ids)
              .flat()
              .filter(_ => _)
              .join(',') || null
          })
          and t.name in (${[...new Set(keys.map(({ tree }) => `'${tree}'`))].join(',') || null})
        ) p
        left outer join VocabularyXrefVocabulary vxv on vxv.parentId = p.id and vxv.vocabularyTreeId = p.treeId
        left outer join Vocabulary children on children.id = vxv.childId
        
        for json auto`

      logSql(sql, 'Search vocabulary tree')

      const results = await query(sql)

      /**
       * Rows are wrapped in 2D array,
       * take the first item in this wrapper
       **/
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
      return keys.map(({ tree, ids = [] }) => {
        return rows?.filter(sift({ tree, id: { $in: ids.filter(_ => _) } })) || []
      })
    },
    {
      batch: true,
      maxBatchSize: 250,
      cache: true,
    }
  )
