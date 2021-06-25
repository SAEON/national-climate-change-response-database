import logSql from '../../../../lib/log-sql.js'
import selectProjects from './select-projects/index.js'

const MAX_PAGE_SIZE = 20

export default async (
  _,
  {
    ids = [],
    vocabularyFilters = [],
    mitigationFilters: { vocabularyFilters: mitigationVocabularyFilters = [] } = {},
    adaptationFilters: { vocabularyFilters: adaptationVocabularyFilters = [] } = {},
    limit = MAX_PAGE_SIZE,
    offset = 0,
  },
  ctx
) => {
  const { query } = ctx.mssql

  if (limit > MAX_PAGE_SIZE) {
    throw new Error(`Projects request is limited to a maximum page size of ${MAX_PAGE_SIZE}`)
  }

  const sql = `
    ${selectProjects({
      ids,
      vocabularyFilters,
      adaptationVocabularyFilters,
      mitigationVocabularyFilters,
      offset,
      limit,
    })}
    `

  logSql(sql, 'Fetch projects', true)
  const result = await query(sql)
  return result.recordset
}
