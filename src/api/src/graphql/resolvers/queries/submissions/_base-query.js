export default ({
  isSubmitted = true,
  validationStatus = undefined,
  projectFilters: {
    title: { value: titleFilter = undefined } = {},
    province: { value: provinceFilter = undefined } = {},
    validationStatus: { value: validationStatusFilter = undefined } = {},
    ...projectVocabularyFilters
  } = {},
  mitigationFilters: { ...mitigationVocabularyFilters } = {},
  adaptationFilters: { ...adaptationVocabularyFilters } = {},
}) => {
  return `
    Submissions s
    where
      deletedAt is null
      and isSubmitted = ${isSubmitted ? 1 : 0}
      ${
        validationStatus
          ? `and json_value(validationStatus, '$.term') = '${sanitizeSqlValue(validationStatus)}'`
          : ''
      }
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
        .map(([fieldName, { value: filter = undefined } = {}]) =>
          filter
            ? `
            and json_value(project, '$.${fieldName}.term') = '${sanitizeSqlValue(filter)}'`
            : ''
        )
        .join('\n')}

      -- Mitigation

      ${Object.entries(mitigationVocabularyFilters)
        .map(([fieldName, { value: filter = undefined } = {}]) =>
          filter
            ? `
            and json_value(mitigation, '$.${fieldName}.term') = '${sanitizeSqlValue(filter)}'`
            : ''
        )
        .join('\n')}

      ${Object.entries(adaptationVocabularyFilters)
        .map(([fieldName, { value: filter = undefined } = {}]) =>
          filter
            ? `
            and json_value(adaptation, '$.${fieldName}.term') = '${sanitizeSqlValue(filter)}'`
            : ''
        )
        .join('\n')}`
}
