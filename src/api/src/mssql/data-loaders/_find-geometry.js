import DataLoader from 'dataloader'
import query from '../query.js'
import sift from 'sift'
import logSql from '../../lib/log-sql.js'

export default () =>
  new DataLoader(
    async keys => {
      const vocabularyIds = []
      const trees = []
      const fields = []

      keys.forEach(({ vocabularyId, tree, simplified }) => {
        vocabularyIds.push(vocabularyId)
        trees.push(tree)
        fields.push(simplified ? 'geometry_simplified' : 'geometry')
      })

      const sql = `
        select
          vxt.vocabularyId,
          t.name tree,
          ${[...new Set(fields)].map(field => `[${field}].STAsText() [${field}]`).join(',')}
        from VocabularyXrefTree vxt
        join VocabularyTrees t on t.id = vxt.vocabularyTreeId
        join GeometryXrefVocabularyTreeX gx on gx.vocabularyXrefTreeId = vxt.id
        join Geometries g on g.id = gx.geometryId

        where
          t.name in (${[...new Set(trees)].map(tree => `'${sanitizeSqlValue(tree)}'`).join(',')})
          and vxt.vocabularyId in (${[...new Set(vocabularyIds)].join(',')})`

      logSql(sql, 'Find geometry')

      const results = await query(sql)
      const rows = results.recordset
      return keys.map(({ vocabularyId, tree }) => rows.filter(sift({ tree, vocabularyId })))
    },
    {
      batch: true,
      maxBatchSize: 250,
      cache: true,
    }
  )
