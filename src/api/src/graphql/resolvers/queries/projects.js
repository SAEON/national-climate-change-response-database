export default async (_, { ids = undefined }, ctx) => {
  const { query } = ctx.mssql
  const result = await query(`
    ;with

    _projects as (
      select
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
      [it].childId interventionTypeId,
      [ps].childId projectStatusId,
      [vs].childId validationStatusId,
      [fs].childId fundingStatusId,
      [eb].childId estimatedBudgetId,
      [hs].childId hostSectorId,
      [hss].childId hostSubSectorId
    
      from Projects p
      left join VocabularyXrefVocabulary [it] on [it].id = p.interventionType
      left join VocabularyXrefVocabulary [ps] on [ps].id = p.projectStatus
      left join VocabularyXrefVocabulary [vs] on [vs].id = p.validationStatus
      left join VocabularyXrefVocabulary [fs] on [fs].id = p.fundingStatus
      left join VocabularyXrefVocabulary [eb] on [eb].id = p.estimatedBudget
      left join VocabularyXrefVocabulary [hs] on [hs].id = p.hostSector
      left join VocabularyXrefVocabulary [hss] on [hss].id = p.hostSubSector
    ),
    
    _mitigations as (
      select
      m.id,
      projectId,
      title,
      m.description,
      carbonCredit,
      volMethodology,
      goldStandard,
      vcs,
      otherCarbonCreditStandard,
      otherCarbonCreditStandardDescription,
      cdmProjectNumber,
      cdmStatus,
      isResearch,
      researchDescription,
      researchType,
      researchTargetAudience,
      researchAuthor,
      researchPaper,
      [mt].childId mitigationTypeId,
      [mst].childId mitigationSubTypeId,
      [is].childId interventionStatusId,
      [cdmm].childId cdmMethodologyId,
      [cdmes].childId cdmExecutiveStatusId,
      [hs].childId hostSectorId,
      [hssp].childId hostSubSectorPrimaryId,
      [hsss].childId hostSubSectorSecondaryId
    
      from Mitigations m
      left join VocabularyXrefVocabulary [mt] on [mt].id = m.mitigationType
      left join VocabularyXrefVocabulary [mst] on [mst].id = m.mitigationSubType
      left join VocabularyXrefVocabulary [is] on [is].id = m.interventionStatus
      left join VocabularyXrefVocabulary [cdmm] on [cdmm].id = m.cdmMethodology
      left join VocabularyXrefVocabulary [cdmes] on [cdmes].id = m.cdmExecutiveStatus
      left join VocabularyXrefVocabulary [hs] on [hs].id = m.hostSector
      left join VocabularyXrefVocabulary [hssp] on [hssp].id = m.hostSubSectorPrimary
      left join VocabularyXrefVocabulary [hsss] on [hsss].id = m.hostSubSectorSecondary
    ),
    
    _adaptations as (
      select
      a.id,
      projectId,
      title,
      a.description,
      startDate,
      endDate,
      xy,
      isResearch,
      researchDescription,
      researchType,
      researchTargetAudience,
      researchAuthor,
      researchPaper,
      [as].childId adaptationSectorId,
      [ap].childId adaptationPurposeId,
      [hf].childId hazardFamilyId,
      [hsf].childId hazardSubFamilyId,
      [h].childId hazardId,
      [sh].childId subHazardId
    
      from Adaptations a
      left join VocabularyXrefVocabulary  [as]  on [as].id = a.adaptationSector
      left join VocabularyXrefVocabulary  [ap]  on [ap].id = a.adaptationPurpose
      left join VocabularyXrefVocabulary  [hf]  on [hf].id = a.hazardFamily
      left join VocabularyXrefVocabulary  [hsf] on [hsf].id = a.hazardSubFamily
      left join VocabularyXrefVocabulary  [h]   on [h].id = a.hazard
      left join VocabularyXrefVocabulary  [sh]  on [sh].id = a.subHazard
    )
    
    select
    p.*,
    ( select * from _mitigations _ where _.projectId = p.id for json path ) mitigations,
    ( select * from _adaptations _ where _.projectId = p.id for json path ) adaptations
    from _projects p
    ${ids?.length ? `where p.id in (${ids.join(',')})` : ''}
    for json path`)

  const rows = result.recordset[0]

  if (rows?.length) {
    return rows
  } else {
    return []
  }
}
