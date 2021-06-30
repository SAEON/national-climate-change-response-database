import { adaptationFields, adaptationVocabularyFields } from '../../../../schema/index.js'

const BLACKLIST_FIELDS_FROM_QUERY = []

const getAdaptationProjection = fields => {
  return `
    ${fields
      .map(field => {
        if (adaptationVocabularyFields.includes(field)) {
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
  const fields = adaptationFields
    .map(({ name }) => name)
    .filter(name => !BLACKLIST_FIELDS_FROM_QUERY.includes(name))

  return `
    select
    ${getAdaptationProjection(fields)}
    from [Adaptations]
      ${fields
        .map(field => {
          if (!adaptationVocabularyFields.includes(field)) {
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
