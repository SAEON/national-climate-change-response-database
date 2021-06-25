import vocabularyFields from '../../../vocabulary-fields.js'

const fields = [
  'id',
  'adaptationSector',
  'correspondingNationalPolicy',
  'correspondingSubNationalPolicy',
  'correspondingAction',
  'hazard',
  'otherHazard',
  'observedClimateChangeImpacts',
  'addressedClimateChangeImpact',
  'responseImpact',
  'hasResearch',
  'researchDescription',
  'researchType',
  'researchTargetAudience',
  'researchAuthor',
  'researchPaper',
]

export const getAdaptationProjection = () => {
  return `
    ${fields
      .map(field => {
        if (vocabularyFields.Adaptations.includes(field)) {
          return `[Adaptations].[${field}] [${field}Id]`
        }

        if (field === 'yx') {
          return `[Adaptations].yx.STAsText() yx`
        }

        return `[Adaptations].[${field}]`
      })
      .join(',')}`
}

export default ({ vocabularyFilters }) => {
  return `
    select
    ${getAdaptationProjection()}
    from [Adaptations]
      ${fields
        .map(field => {
          if (!vocabularyFields.Adaptations.includes(field)) {
            return ''
          }

          return `
            left join VocabularyXrefTree [${field}_xtree] on [${field}_xtree].id = [Adaptations].[${field}]
            left join Vocabulary ${field} on ${field}.id = [${field}_xtree].vocabularyId`
        })
        .join('\n')}
        
    where [Adaptations].deletedAt is null and
      [Adaptations].projectId = Projects.id
      ${vocabularyFilters.length ? 'and ' : ''}
      ${vocabularyFilters
        .map(({ field: joinAlias, term }) => `[${joinAlias}].term = '${sanitizeSqlValue(term)}'`)
        .join(' and ')}`
}
