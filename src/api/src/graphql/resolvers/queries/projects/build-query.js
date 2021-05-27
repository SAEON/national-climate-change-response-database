import vocabularyFields from './vocabulary-fields.js'

export const getProjection = ({ table, fields }) => {
  return `
    ${fields
      .map(field => {
        if (vocabularyFields[table].includes(field)) return `[${table}].[${field}] [${field}Id]`
        if (field === 'yx') return `[${table}].yx.STAsText() yx`
        return `[${table}].[${field}]`
      })
      .join(',')}`
}

export const getFinalProjection = ({ table, fields }) => {
  return `
    ${fields
      .map(field => {
        if (vocabularyFields[table].includes(field)) return `[${table}].[${field}Id]`
        return `[${table}].[${field}]`
      })
      .join(',')}`
}

export default ({ fields, table, ids, vocabularyFilters }) => {
  return `
    select
    ${getProjection({ table, fields })}
    from [${table}]
      ${fields
        .map(field => {
          if (!vocabularyFields[table].includes(field)) return ''
          return `
            left join VocabularyXrefTree [${field}_xtree] on [${field}_xtree].id = [${table}].[${field}]
            left join Vocabulary ${field} on ${field}.id = [${field}_xtree].vocabularyId`
        })
        .join('\n')}
        
    where
      ${ids.length ? `[${table}].id in (${ids.join(',')})` : '1 = 1'}
      ${vocabularyFilters.length ? 'and ' : ''}
      ${vocabularyFilters
        .map(({ field: joinAlias, term }) => {
          return `[${joinAlias}].term = '${sanitizeSqlValue(term)}'`
        })
        .join(' and ')}`
}
