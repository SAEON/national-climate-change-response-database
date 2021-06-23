export const Projects = [
  'interventionType',
  'implementationStatus',
  'fundingType',
  'estimatedBudget',
  'province',
  'districtMunicipality',
  'localMunicipality',
  'validationStatus',
]

export const Mitigations = [
  'hostSector',
  'hostSubSectorPrimary',
  'hostSubSectorSecondary',
  'mitigationType',
  'mitigationSubType',
  'mitigationProgramme',
  'correspondingNationalPolicy',
  'correspondingSubNationalPolicy',
  'coBenefitEnvironmental',
  'coBenefitSocial',
  'coBenefitEconomic',
  'carbonCreditStandard',
  'carbonCreditCdmExecutiveStatus',
  'carbonCreditCdmMethodology',
  'carbonCreditVoluntaryOrganization',
]

export const Adaptations = [
  'adaptationSector',
  'adaptationPurpose',
  'interventionStatus',
  'hazardFamily',
  'hazardSubFamily',
  'hazard',
  'subHazard',
]

export const vocabularyFields = {
  Projects,
  p: Projects,
  Mitigations,
  m: Mitigations,
  Adaptations,
  a: Adaptations,
}

export default vocabularyFields
