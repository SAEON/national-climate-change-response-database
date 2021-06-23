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
  'mitigationType',
  'mitigationSubType',
  'interventionStatus',
  'cdmMethodology',
  'cdmExecutiveStatus',
  'hostSector',
  'hostSubSectorPrimary',
  'hostSubSectorSecondary',
  'energyOrEmissionsData',
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
