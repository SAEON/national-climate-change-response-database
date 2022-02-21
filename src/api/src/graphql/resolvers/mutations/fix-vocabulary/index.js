import getQuery from '../../queries/fix-vocabulary-sql/index.js'
import { pool } from '../../../../mssql/pool.js'

export default async (self, { term, field, incorrectTerm }, ctx) => {
  const { query, params } = await getQuery(null, { term, field, incorrectTerm }, ctx)

  const request = (await pool.connect()).request()
  Object.entries(params).forEach(([name, value]) => {
    request.input(name, value)
  })

  await request.query(query)
  return true
}
