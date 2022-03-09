export default ({
  request,
  isSubmitted = true,
  tenantId,
  projectFilters: {
    title: { value: titleFilter = undefined } = {},
    province: { value: provinceFilter = undefined } = {},
    submissionStatus: { value: submissionStatusFilter = null } = {},
    ...projectVocabularyFilters
  } = {},
  mitigationFilters: { ...mitigationVocabularyFilters } = {},
  adaptationFilters: { ...adaptationVocabularyFilters } = {},
}) => {
  // Configure params
  request.input('isSubmitted', isSubmitted === true ? 1 : 0)
  request.input('tenantId', tenantId)
  request.input('submissionStatusFilter', submissionStatusFilter)

  // titleFilter
  const strtWldCrd = titleFilter?.[0] === '%'
  const endWildCrd = titleFilter?.[titleFilter?.length - 1] === '%'
  titleFilter = titleFilter ? titleFilter.replace(/%/, '').replace(/%$/, '') : null
  request.input('titleFilter', titleFilter)

  return `
    Submissions s
    where
      exists ( select 1 from TenantXrefSubmission x where x.tenantId = @tenantId
      and x.submissionId = s.id)
      and deletedAt is null
      and isSubmitted = @isSubmitted
      and json_value(submissionStatus, '$.term') = coalesce(@submissionStatusFilter, json_value(submissionStatus, '$.term'))
      and _projectTitle ${
        strtWldCrd || endWildCrd
          ? `like ${strtWldCrd ? `'%' + ` : ''} @titleFilter ${endWildCrd ? ` + '%'` : ''}`
          : `= coalesce(@titleFilter, _projectTitle)`
      }
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
