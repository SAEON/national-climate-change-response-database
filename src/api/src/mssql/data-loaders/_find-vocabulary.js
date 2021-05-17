import DataLoader from 'dataloader'
import query from '../query.js'
import sift from 'sift'

export default () =>
  new DataLoader(
    async keys => {
      const result = await query(`
        select *
        from Vocabulary v
        where v.id in (${keys.join(',')})`)

      return keys.map(id => result.recordset.filter(sift({ id })))
    },
    {
      batch: true,
      maxBatchSize: 250,
      cache: true,
    }
  )
