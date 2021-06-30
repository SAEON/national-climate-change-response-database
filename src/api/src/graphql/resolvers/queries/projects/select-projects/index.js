import { projectFields, projectVocabularyFields } from '../../../../schema/index.js'
import selectAdaptation from './_adaptation.js'
import selectMitigation from './_mitigation.js'

const BLACKLIST_FIELDS_FROM_QUERY = ['mitigation', 'adaptation']

const getProjectProjection = (
  fields,
  { adaptationVocabularyFilters, mitigationVocabularyFilters }
) => {
  return `
    ${fields
      .map(field => {
        if (projectVocabularyFields.includes(field)) {
          return `[Projects].[${field}] [${field}Id]`
        }

        if (field === 'yx') {
          return `[Projects].yx.STAsText() yx`
        }

        return `[Projects].[${field}]`
      })
      .join(',')},
      ( ${selectAdaptation({
        vocabularyFilters: adaptationVocabularyFilters,
      })} for json path, without_array_wrapper ) adaptation,
      ( ${selectMitigation({
        vocabularyFilters: mitigationVocabularyFilters,
      })} for json path, without_array_wrapper ) mitigation`
}

export default ({
  ids,
  vocabularyFilters,
  adaptationVocabularyFilters,
  mitigationVocabularyFilters,
  offset,
  limit,
}) => {
  const fields = projectFields
    .map(({ name }) => name)
    .filter(name => !BLACKLIST_FIELDS_FROM_QUERY.includes(name))

  return `
    select
    ${getProjectProjection(fields, {
      adaptationVocabularyFilters,
      mitigationVocabularyFilters,
    })}
    from [Projects]
      ${fields
        .map(field => {
          if (!projectVocabularyFields.includes(field)) {
            return ''
          }

          return `
            left join VocabularyXrefTree [${field}_xtree] on [${field}_xtree].id = [Projects].[${field}]
            left join Vocabulary ${field} on ${field}.id = [${field}_xtree].vocabularyId`
        })
        .join('\n')}
        
    where [Projects].deletedAt is null and
      ${ids.length ? `[Projects].id in (${ids.join(',')})` : '1 = 1'}
      ${vocabularyFilters.length ? 'and ' : ''}
      ${vocabularyFilters
        .map(({ field: joinAlias, term }) => `[${joinAlias}].term = '${sanitizeSqlValue(term)}'`)
        .join(' and ')}
        
    order by id asc
    offset ${offset} rows
    fetch next ${limit} rows only`
}
