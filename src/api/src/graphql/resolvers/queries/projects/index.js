import logSql from '../../../../lib/log-sql.js'
import getFieldSelections from './get-field-selections.js'
import buildQuery, { getFinalProjection } from './build-query.js'

/**
 * https://stackoverflow.com/a/48011514/3114742
 *
 * TODO. Fragments and inline fragments as part
 * of the GraphQL query will cause this to fail
 * because the SQL is built dynamically using the
 * GraphQL field selection (but only normal fields)
 * are currently considered.
 *
 * To fix this (shouldn't be too hard), look for
 * 'TODO - merge field types'
 */

export default async (
  _,
  {
    ids = [],
    vocabularyFilters = [],
    mitigationFilters = undefined,
    adaptationFilters = undefined,
    limit = undefined,
    offset = undefined,
  },
  ctx
) => {
  let isPaginated = false
  const { query } = ctx.mssql

  /**
   * Validate pagination args (if included)
   */
  if (typeof limit === 'number' || typeof offset === 'number') {
    if (isNaN(parseInt(limit, 10)) || isNaN(parseInt(offset, 10))) {
      throw new Error(
        'Either BOTH limit and offset args must be defined, or NEITHER must be defined'
      )
    }

    isPaginated = true
  }

  const { ids: mitigationIds = [], vocabularyFilters: mitigationVocabularyFilters = [] } =
    mitigationFilters || {}

  const { ids: adaptationIds = [], vocabularyFilters: adaptationVocabularyFilters = [] } =
    adaptationFilters || {}

  const sql = `
    select *
    from Projects
    where
      deletedAt is null`

  logSql(sql, 'Fetch projects')

  const result = await query(sql)
  console.log(result.recordset)

  return result.recordset
}
