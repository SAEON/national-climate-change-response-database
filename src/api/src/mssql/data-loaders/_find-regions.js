import DataLoader from 'dataloader'
import { pool } from '../pool.js'
import sift from 'sift'

/**
 * The geometry column is omitted here
 * because it could slow down the query.
 *
 * Fetch it separately, lazily
 */

export default () =>
  new DataLoader(
    async keys => {
      const _pool = await pool.connect()
      const request = _pool.request()
      keys.forEach((key, i) => request.input(`key_${i}`, key))

      const result = await request.query(`
      select
        r.id,
        r.properties,
        r.code,
        r.parentCode,
        r.name,
        r.[geometry].Reduce(0.005).STAsText() [geometry],
        r.centroid.STAsText() centroid,
        ( select
            v.id,
            v.code,
            v.term
          from Vocabulary v
          join VocabularyXrefRegion x on x.vocabularyId = v.id
          where x.regionId = r.id for json path ) vocabulary
        
      from Regions r
      where
        r.id in (${keys.map((_, i) => `@key_${i}`)});`)

      return keys.map(id => result.recordset.filter(sift({ id })))
    },
    {
      batch: true,
      maxBatchSize: 250,
      cache: true,
    }
  )
