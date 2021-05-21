import logSql from '../../../lib/log-sql.js'

export default async (_, { ids = undefined }, ctx) => {
  const { query } = ctx.mssql

  const sql = `
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
        interventionType interventionTypeId,
        projectStatus projectStatusId,
        validationStatus validationStatusId,
        fundingStatus fundingStatusId,
        estimatedBudget estimatedBudgetId,
        hostSector hostSectorId,
        hostSubSector hostSubSectorId
      from Projects p
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
        mitigationType mitigationTypeId,
        mitigationSubType mitigationSubTypeId,
        interventionStatus interventionStatusId,
        cdmMethodology cdmMethodologyId,
        cdmExecutiveStatus cdmExecutiveStatusId,
        hostSector hostSectorId,
        hostSubSectorPrimary hostSubSectorPrimaryId,
        hostSubSectorSecondary hostSubSectorSecondaryId
      from Mitigations m
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
        adaptationSector adaptationSectorId,
        adaptationPurpose adaptationPurposeId,
        hazardFamily hazardFamilyId,
        hazardSubFamily hazardSubFamilyId,
        hazard hazardId,
        subHazard subHazardId,
        province provinceId,
        districtMunicipality districtMunicipalityId,
        localMunicipality localMunicipalityId
      from Adaptations a
    )
    
    select
    p.*,
    ( select * from _mitigations _ where _.projectId = p.id for json path ) mitigations,
    ( select * from _adaptations _ where _.projectId = p.id for json path ) adaptations
    from _projects p
    ${ids?.length ? `where p.id in (${ids.join(',')})` : ''}
    for json path`

  logSql(sql, 'Projects')

  const result = await query(sql)

  const rows = result.recordset[0]

  if (rows?.length) {
    return rows
  } else {
    return []
  }
}
