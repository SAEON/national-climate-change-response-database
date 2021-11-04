import DataLoader from 'dataloader'
import { pool } from '../pool.js'
import sift from 'sift'

export default () =>
  new DataLoader(
    async keys => {
      const ids = []
      const trees = []
      keys.forEach(({ vocabularyId, tree }) => {
        if (!ids.includes(vocabularyId)) ids.push(vocabularyId)
        if (!trees.includes(tree)) trees.push(tree)
      })

      const request = (await pool.connect()).request()
      trees.forEach((tree, i) => request.input(`tree_${i}`, tree))
      ids.forEach((id, i) => request.input(`id_${i}`, id))

      const sql = `
        select
          vxt.vocabularyId,
          t.name tree,
          [geometry].STAsText() [geometry]
        from VocabularyXrefTree vxt
        join Trees t on t.id = vxt.treeId
        join GeometryXrefVocabularyTreeX gx on gx.vocabularyXrefTreeId = vxt.id
        join Geometries g on g.id = gx.geometryId
        where
          t.name in (${trees.map((_, i) => `@tree_${i}`).join(',')})
          and vxt.vocabularyId in (${ids.map((_, i) => `@id_${i}`).join(',')})`

      const result = await request.query(sql)
      const rows = result.recordset
      return keys.map(({ vocabularyId, tree }) => rows.filter(sift({ tree, vocabularyId })))
    },
    {
      batch: true,
      maxBatchSize: 250,
      cache: true,
    }
  )
