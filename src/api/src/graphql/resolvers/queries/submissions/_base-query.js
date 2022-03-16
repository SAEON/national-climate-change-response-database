import PERMISSIONS from '../../../../user-model/permissions.js'

export default async (
  ctx,
  {
    request,
    isSubmitted = true,
    tenantId,
    submissionStatus = null,
    projectFilters: {
      title: { value: titleFilter = null } = {},
      province: { value: provinceFilter = null } = {},
      submissionStatus: { value: submissionStatusFilter = null } = {},
      ...projectVocabularyFilters
    } = {},
    mitigationFilters: { ...mitigationVocabularyFilters } = {},
    adaptationFilters: { ...adaptationVocabularyFilters } = {},
  }
) => {
  // Get allowed entity fields for validating input
  const {
    inputFields: {
      project: { fields: projectFields },
      mitigation: { fields: mitigationFields },
      adaptation: { fields: adaptationFields },
    },
  } = ctx.gql

  // Configure params
  request.input('isSubmitted', isSubmitted === true ? 1 : 0)
  request.input('tenantId', tenantId)
  request.input('provinceFilter', provinceFilter)

  // Set submissionStatus to 'accepted' if user's role doesn't allow for validating submissions
  try {
    await ctx.user.ensurePermission({ ctx, permission: PERMISSIONS['validate-submission'] })
  } catch {
    submissionStatus = 'Accepted'
  }

  submissionStatus = submissionStatus || submissionStatusFilter
  request.input('submissionStatus', submissionStatus)

  // titleFilter
  const startWldCrd = titleFilter?.[0] === '%'
  const endWildCrd = titleFilter?.[titleFilter?.length - 1] === '%'
  titleFilter = titleFilter ? titleFilter.replace(/%/, '').replace(/%$/, '') : null
  request.input('titleFilter', titleFilter)

  // projectVocabularyFilters
  Object.entries(projectVocabularyFilters).forEach(
    ([fieldName, { value: filter = null } = {}], i) => {
      if (!projectFields[fieldName]) {
        throw new Error(
          'Incorrect general details field specified in filter. Possible SQL injection attempt'
        )
      }

      request.input(`projectVFilter_${i}`, filter)
    }
  )

  // mitigationVocabularyFilters
  Object.entries(mitigationVocabularyFilters).forEach(
    ([fieldName, { value: filter = null } = {}], i) => {
      if (!mitigationFields[fieldName]) {
        throw new Error(
          'Incorrect mitigation details field specified in filter. Possible SQL injection attempt'
        )
      }

      request.input(`mitigationVFilter_${i}`, filter)
    }
  )

  // adaptationVocabularyFilters
  Object.entries(adaptationVocabularyFilters).forEach(
    ([fieldName, { value: filter = null } = {}], i) => {
      if (!adaptationFields[fieldName]) {
        throw new Error(
          'Incorrect adaptation details field specified in filter. Possible SQL injection attempt'
        )
      }

      request.input(`adaptationVFilter_${i}`, filter)
    }
  )

  return `
    Submissions s
    where
      exists ( select 1 from TenantXrefSubmission x where x.tenantId = @tenantId
      and x.submissionId = s.id)
      and deletedAt is null
      and isSubmitted = @isSubmitted
      ${submissionStatus ? `and json_value(submissionStatus, '$.term') = @submissionStatus` : ''}
      ${
        titleFilter
          ? `and _projectTitle ${
              startWldCrd || endWildCrd
                ? `like ${startWldCrd ? `'%' + ` : ''} @titleFilter ${endWildCrd ? ` + '%'` : ''}`
                : `= @titleFilter`
            }`
          : ''
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
              where
                p like '%' + @provinceFilter + '%'
            )`
          : ''
      }

      -- General details filters
      ${Object.entries(projectVocabularyFilters)
        .map(([fieldName, { value: filter = undefined } = {}], i) =>
          filter
            ? `
            and json_value(project, '$.${fieldName}.term') = @projectVFilter_${i}`
            : ''
        )
        .join('\n')}

      -- Mitigation details filters
      ${Object.entries(mitigationVocabularyFilters)
        .map(([fieldName, { value: filter = undefined } = {}], i) =>
          filter
            ? `
            and json_value(mitigation, '$.${fieldName}.term') = @mitigationVFilter_${i}`
            : ''
        )
        .join('\n')}

      -- Adaptation details filters
      ${Object.entries(adaptationVocabularyFilters)
        .map(([fieldName, { value: filter = undefined } = {}], i) =>
          filter
            ? `
            and json_value(adaptation, '$.${fieldName}.term') = @adaptationVFilter_${i}`
            : ''
        )
        .join('\n')}`
}
