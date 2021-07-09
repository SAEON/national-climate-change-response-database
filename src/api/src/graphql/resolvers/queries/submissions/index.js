import logSql from '../../../../lib/log-sql.js'

const MAX_PAGE_SIZE = 20

export default async (
  _,
  {
    isSubmitted = true,
    projectFilters: {
      title: { value: titleFilter = undefined } = {},
      province: { value: provinceFilter = undefined },
      validationStatus: { value: validationStatusFilter = undefined } = {},
      ...projectVocabularyFilters
    } = {},
    mitigationFilters: { ...mitigationVocabularyFilters } = {},
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
    select
    *
    from Submissions s
    where
      deletedAt is null
      and isSubmitted = ${isSubmitted ? 1 : 0}
      ${titleFilter ? `and _projectTitle like '%${sanitizeSqlValue(titleFilter)}%'` : ''}
      ${
        provinceFilter
          ? `and s.id in (
              select
              id
              from (
                select
                id,
                json_query(project, '$.province') p
              ) tbl
              where p like '%${sanitizeSqlValue(provinceFilter)}%'
            )`
          : ''
      }
      ${
        validationStatusFilter
          ? `and json_value(validationStatus, '$.term') = '${sanitizeSqlValue(
              validationStatusFilter
            )}'`
          : ''
      }
      ${Object.entries(projectVocabularyFilters)
        .map(([fieldName, { value: filter = undefined }]) =>
          filter
            ? `
            and json_value(project, '$.${fieldName}.term') = '${sanitizeSqlValue(filter)}'`
            : ''
        )
        .join('\n')}

      -- Mitigation

      ${Object.entries(mitigationVocabularyFilters)
        .map(([fieldName, { value: filter = undefined }]) =>
          filter
            ? `
            and json_value(mitigation, '$.${fieldName}.term') = '${sanitizeSqlValue(filter)}'`
            : ''
        )
        .join('\n')}
      
    order by id asc
    offset ${offset} rows
    fetch next ${limit} rows only`

  logSql(sql, 'Submissions', true)
  const result = await query(sql)
  return result.recordset
}
