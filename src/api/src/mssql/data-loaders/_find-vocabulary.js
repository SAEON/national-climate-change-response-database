import DataLoader from 'dataloader'
import query from '../query.js'

export default () =>
  new DataLoader(
    async keys => {
      const result = await query(`select 1`)

      return new Array(keys.length)
    },
    {
      batch: true,
      maxBatchSize: 250,
      cache: true,
    }
  )
