export default ({
  isSubmitted = true,
  submissionStatus = undefined,
  tenantId,
  projectFilters: {
    title: { value: titleFilter = undefined } = {},
    province: { value: provinceFilter = undefined } = {},
    submissionStatus: { value: submissionStatusFilter = undefined } = {},
    ...projectVocabularyFilters
  } = {},
  mitigationFilters: { ...mitigationVocabularyFilters } = {},
  adaptationFilters: { ...adaptationVocabularyFilters } = {},
}) => {
  return `
    Submissions s
    where
      exists ( select 1 from TenantXrefSubmission x where x.tenantId = '${sanitizeSqlValue(
        tenantId
      )}' and x.submissionId = s.id)
      and deletedAt is null
      and isSubmitted = ${isSubmitted ? 1 : 0}
      ${
        submissionStatus
          ? `and json_value(submissionStatus, '$.term') = '${sanitizeSqlValue(submissionStatus)}'`
          : ''
      }
      ${titleFilter ? `and _projectTitle like '${sanitizeSqlValue(titleFilter)}'` : ''}
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
        submissionStatusFilter
          ? `and json_value(submissionStatus, '$.term') = '${sanitizeSqlValue(
              submissionStatusFilter
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
