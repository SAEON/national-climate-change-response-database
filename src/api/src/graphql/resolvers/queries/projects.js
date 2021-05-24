import logSql from '../../../lib/log-sql.js'

export default async (
  _,
  {
    ids = [],
    vocabularyFilters = [],
    mitigationFilters = undefined,
    adaptationFilters = undefined,
  },
  ctx
) => {
  const { query } = ctx.mssql

  const { ids: mitigationIds = [], vocabularyFilters: mitigationVocabularyFilters = [] } =
    mitigationFilters || {}

  const { ids: adaptationIds = [], vocabularyFilters: adaptationVocabularyFilters = [] } =
    adaptationFilters || {}

  const sql = `
    ;with

    _projects as (
      select distinct
        p.id,
        p.title,
        p.[description],
        p.projectManager,
        p.link,
        p.startDate,
        p.endDate,
        p.validationComments,
        p.fundingOrganisation,
        p.fundingPartner,
        p.budgetLower,
        p.budgetUpper,
        p.hostOrganisation,
        p.hostPartner,
        p.alternativeContact,
        p.alternativeContactEmail,
        p.leadAgent,
        p.interventionType interventionTypeId,
        p.projectStatus projectStatusId,
        p.validationStatus validationStatusId,
        p.fundingStatus fundingStatusId,
        p.estimatedBudget estimatedBudgetId,
        p.hostSector hostSectorId,
        p.hostSubSector hostSubSectorId,
        p.province provinceId,
        p.districtMunicipality districtMunicipalityId,
        p.localMunicipality localMunicipalityId

      from Projects p
      left join VocabularyXrefTree [it] on [it].id = p.interventionType
      left join VocabularyXrefTree [ps] on [ps].id = p.projectStatus
      left join VocabularyXrefTree [vs] on [vs].id = p.validationStatus
      left join VocabularyXrefTree [fs] on [fs].id = p.fundingStatus
      left join VocabularyXrefTree [eb] on [eb].id = p.estimatedBudget
      left join VocabularyXrefTree [hs] on [hs].id = p.hostSector
      left join VocabularyXrefTree [hss] on [hss].id = p.hostSubSector
      left join VocabularyXrefTree [pr] on [pr].id = p.province
      left join VocabularyXrefTree [dm] on [dm].id = p.districtMunicipality
      left join VocabularyXrefTree [lm] on [lm].id = p.localMunicipality
      left join Vocabulary interventionType on interventionType.id = [it].vocabularyId
      left join Vocabulary projectStatus on projectStatus.id = [ps].vocabularyId
      left join Vocabulary validationStatus on validationStatus.id = [vs].vocabularyId
      left join Vocabulary fundingStatus on fundingStatus.id = [fs].vocabularyId
      left join Vocabulary estimatedBudget on estimatedBudget.id = [eb].vocabularyId
      left join Vocabulary hostSector on hostSector.id = [hs].vocabularyId
      left join Vocabulary hostSubSector on hostSubSector.id = [hss].vocabularyId
      left join Vocabulary province on province.id = [pr].vocabularyId      
      left join Vocabulary districtMunicipality on districtMunicipality.id = [dm].vocabularyId      
      left join Vocabulary localMunicipality on localMunicipality.id = [lm].vocabularyId        

      where
        ${ids.length ? `p.id in (${ids.join(',')})` : '1 = 1'}
        ${vocabularyFilters.length ? 'and ' : ''}
        ${vocabularyFilters
          .map(({ field: joinAlias, term }) => {
            return `[${joinAlias}].term = '${sanitizeSqlValue(term)}'`
          })
          .join(' and ')}
    ),
    
    _mitigations as (
      select distinct
        m.id,
        m.projectId,
        m.title,
        m.description,
        m.carbonCredit,
        m.volMethodology,
        m.goldStandard,
        m.vcs,
        m.otherCarbonCreditStandard,
        m.otherCarbonCreditStandardDescription,
        m.cdmProjectNumber,
        m.cdmStatus,
        m.isResearch,
        m.researchDescription,
        m.researchType,
        m.researchTargetAudience,
        m.researchAuthor,
        m.researchPaper,
        m.mitigationType mitigationTypeId,
        m.mitigationSubType mitigationSubTypeId,
        m.interventionStatus interventionStatusId,
        m.cdmMethodology cdmMethodologyId,
        m.cdmExecutiveStatus cdmExecutiveStatusId,
        m.hostSector hostSectorId,
        m.hostSubSectorPrimary hostSubSectorPrimaryId,
        m.hostSubSectorSecondary hostSubSectorSecondaryId
      
      from Mitigations m
      left join VocabularyXrefTree [mt] on [mt].id = m.mitigationType
      left join VocabularyXrefTree [mst] on [mst].id = m.mitigationSubType
      left join VocabularyXrefTree [is] on [is].id = m.interventionStatus
      left join VocabularyXrefTree [cm] on [cm].id = m.cdmMethodology
      left join VocabularyXrefTree [ces] on [ces].id = m.cdmExecutiveStatus
      left join VocabularyXrefTree [hs] on [hs].id = m.hostSector
      left join VocabularyXrefTree [hssp] on [hssp].id = m.hostSubSectorPrimary
      left join VocabularyXrefTree [hsss] on [hsss].id = m.hostSubSectorSecondary
      left join Vocabulary mitigationType on mitigationType.id = [mt].vocabularyId
      left join Vocabulary mitigationSubType on mitigationSubType.id = [mst].vocabularyId
      left join Vocabulary interventionStatus on interventionStatus.id = [is].vocabularyId
      left join Vocabulary cdmMethodology on cdmMethodology.id = [cm].vocabularyId
      left join Vocabulary cdmExecutiveStatus on cdmExecutiveStatus.id = [ces].vocabularyId
      left join Vocabulary hostSector on hostSector.id = [hs].vocabularyId
      left join Vocabulary hostSubSectorPrimary on hostSubSectorPrimary.id = [hssp].vocabularyId
      left join Vocabulary hostSubSectorSecondary on hostSubSectorSecondary.id = [hsss].vocabularyId
      
      where
        ${mitigationIds.length ? `m.id in (${mitigationIds.join(',')})` : '1 = 1'}
        ${mitigationVocabularyFilters.length ? 'and ' : ''}
        ${mitigationVocabularyFilters
          .map(({ field: joinAlias, term }) => {
            return `[${joinAlias}].term = '${sanitizeSqlValue(term)}'`
          })
          .join(' and ')}        
    ),
    
    _adaptations as (
      select
        a.id,
        a.projectId,
        a.title,
        a.description,
        a.startDate,
        a.endDate,
        a.xy,
        a.isResearch,
        a.researchDescription,
        a.researchType,
        a.researchTargetAudience,
        a.researchAuthor,
        a.researchPaper,
        a.adaptationSector adaptationSectorId,
        a.adaptationPurpose adaptationPurposeId,
        a.hazardFamily hazardFamilyId,
        a.hazardSubFamily hazardSubFamilyId,
        a.hazard hazardId,
        a.subHazard subHazardId

      from Adaptations a

      where
        ${adaptationIds.length ? `a.id in (${adaptationIds.join(',')})` : '1 = 1'}
        ${adaptationVocabularyFilters.length ? 'and ' : ''}
        ${adaptationVocabularyFilters
          .map(({ field: joinAlias, term }) => {
            return `[${joinAlias}].term = '${sanitizeSqlValue(term)}'`
          })
          .join(' and ')}          
    )
    
    select
      p.*,
      ( select * from _mitigations _ where _.projectId = p.id for json path ) mitigations,
      ( select * from _adaptations _ where _.projectId = p.id for json path ) adaptations
    
    from _projects p
    
    where exists
      ${
        mitigationFilters
          ? `( select 1 from _mitigations m where m.projectId = p.id  )`
          : '( select 1 )'
      }
      ${
        adaptationFilters
          ? `and where exists ( select 1 from _adaptations a where a.projectId = p.id )`
          : ''
      }
    
    for json path;`

  logSql(sql, 'Projects')
  const result = await query(sql)
  const rows = result.recordset[0]
  return rows || []
}
