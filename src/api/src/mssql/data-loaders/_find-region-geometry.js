import DataLoader from 'dataloader'
import { pool } from '../pool.js'
import sift from 'sift'

export default () =>
  new DataLoader(
    async keys => {
      const vocabularyIds = [...new Set(keys)]

      const request = (await pool.connect()).request()
      vocabularyIds.forEach((id, i) => {
        request.input(`id_${i}`, id)
      })

      const result = await request.query(`
        select
          x.vocabularyId,
          r.[geometry].Reduce(0.005).STAsText() [geometry]
        from VocabularyXrefRegion x
        join Regions r on r.id = x.regionId
        where
          x.vocabularyId in (${vocabularyIds.map((_, i) => `@id_${i}`).join(',')});`)

      const rows = result.recordset
      return keys.map(vocabularyId => rows.filter(sift({ vocabularyId })))
    },
    {
      batch: true,
      maxBatchSize: 250,
      cache: true,
    }
  )
