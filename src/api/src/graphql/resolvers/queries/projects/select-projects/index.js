import vocabularyFields from '../../../vocabulary-fields.js'
import selectAdaptation from './_adaptation.js'
import selectMitigation from './_mitigation.js'

const fields = [
  'id',
  'title',
  'description',
  'interventionType',
  'link',
  'implementationStatus',
  'implementingOrganization',
  'fundingOrganisation',
  'fundingType',
  'actualBudget',
  'estimatedBudget',
  'cityOrTown',
  'province',
  'districtMunicipality',
  'localMunicipality',
  'yx',
  'projectManagerName',
  'projectManagerOrganization',
  'projectManagerPosition',
  'projectManagerEmail',
  'projectManagerTelephone',
  'projectManagerMobile',
  'validationStatus',
  'validationComments',
]

export const getProjectProjection = ({
  adaptationVocabularyFilters,
  mitigationVocabularyFilters,
}) => {
  return `
    ${fields
      .map(field => {
        if (vocabularyFields.Projects.includes(field)) {
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
  return `
    select
    ${getProjectProjection({ adaptationVocabularyFilters, mitigationVocabularyFilters })}
    from [Projects]
      ${fields
        .map(field => {
          if (!vocabularyFields.Projects.includes(field)) {
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
