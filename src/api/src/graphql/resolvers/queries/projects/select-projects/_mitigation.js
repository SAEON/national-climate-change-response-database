import { mitigationFields, mitigationVocabularyFields } from '../../../../schema/index.js'

const BLACKLIST_FIELDS_FROM_QUERY = []

const getMitigationProjection = fields => {
  return `
    ${fields
      .map(field => {
        if (mitigationVocabularyFields.includes(field)) {
          return `[Mitigations].[${field}] [${field}Id]`
        }

        if (field === 'emissionsData') {
          return `( 
            select
            e.year,
            e.notes,
            v.term,
            ( select
              v.term name,
              x.tonnesPerYear
              from EmissionsDataXrefVocabTreeX x
              join VocabularyXrefTree vxt on vxt.id = x.chemical
              join Vocabulary v on v.id = vxt.vocabularyId
              where x.emissionsDataId = e.id
              for json path ) emissions
            from EmissionsData e
            join VocabularyXrefTree vxt on vxt.id = e.emissionType
            join Vocabulary v on v.id = vxt.vocabularyId
            
            where
              e.mitigationId = [Mitigations].id
              and e.deletedAt is null
            for json path
           ) emissionsData`
        }

        if (field === 'progressData') {
          return `(
            select
            pd.year,
            pd.achieved,
            v.term
            
            from ProgressData pd
            left outer join VocabularyXrefTree vxt on vxt.id = pd.achievedUnit
            left outer join Vocabulary v on v.id = vxt.vocabularyId
            
            where
              pd.mitigationId = [Mitigations].id
              and pd.deletedAt is null
            for json path
          ) progressData`
        }

        if (field === 'expenditureData') {
          return `(
            select
              e.year,
              e.expenditureZar
            from ExpenditureData e
            where
              e.mitigationId = [Mitigations].id
              and e.deletedAt is null
            for json path
          ) expenditureData`
        }

        if (field === 'energyData') {
          return `(
            select
            e.year,
            e.annualKwh,
            e.annualKwhPurchaseReduction,
            e.notes,
            v.term
            
            from EnergyData e
            join VocabularyXrefTree vxt on vxt.id = e.energyType
            join Vocabulary v on v.id = vxt.vocabularyId
            
            where
              e.mitigationId = [Mitigations].id
              and e.deletedAt is null
            for json path
          ) energyData`
        }

        return `[Mitigations].[${field}]`
      })
      .join(',')}`
}

export default ({ vocabularyFilters }) => {
  const fields = mitigationFields
    .map(({ name }) => name)
    .filter(name => !BLACKLIST_FIELDS_FROM_QUERY.includes(name))

  return `
    select
    ${getMitigationProjection(fields)}
    from [Mitigations]
      ${fields
        .map(field => {
          if (!mitigationVocabularyFields.includes(field)) {
            return ''
          }

          return `
            left join VocabularyXrefTree [${field}_xtree] on [${field}_xtree].id = [Mitigations].[${field}]
            left join Vocabulary ${field} on ${field}.id = [${field}_xtree].vocabularyId`
        })
        .join('\n')}
        
    where [Mitigations].deletedAt is null and
      [Mitigations].projectId = Projects.id
      ${vocabularyFilters.length ? 'and ' : ''}
      ${vocabularyFilters
        .map(({ field: joinAlias, term }) => `[${joinAlias}].term = '${sanitizeSqlValue(term)}'`)
        .join(' and ')}`
}
