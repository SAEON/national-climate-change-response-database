import vocabularyFields from '../../../vocabulary-fields.js'

const fields = [
  'id',
  'hostSector',
  'hostSubSectorPrimary',
  'hostSubSectorSecondary',
  'mitigationType',
  'mitigationSubType',
  'mitigationProgramme',
  'nationalPolicy',
  'otherNationalPolicy',
  'regionalPolicy',
  'otherRegionalPolicy',
  'primaryIntendedOutcome',
  'coBenefitEnvironmental',
  'coBenefitEnvironmentalDescription',
  'coBenefitSocial',
  'coBenefitSocialDescription',
  'coBenefitEconomic',
  'coBenefitEconomicDescription',
  'expenditureData',
  'carbonCredit',
  'carbonCreditStandard',
  'carbonCreditCdmExecutiveStatus',
  'carbonCreditCdmMethodology',
  'carbonCreditVoluntaryOrganization',
  'carbonCreditVoluntaryMethodology',
  'hasEnergyData',
  'energyData',
  'hasEmissionsData',
  'emissionsData',
  'progressData',
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
        if (vocabularyFields.Mitigations.includes(field)) {
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
  return `
    select
    ${getAdaptationProjection()}
    from [Mitigations]
      ${fields
        .map(field => {
          if (!vocabularyFields.Mitigations.includes(field)) {
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
