const Projects = [
  'interventionType',
  'projectStatus',
  'validationStatus',
  'fundingStatus',
  'estimatedBudget',
  'hostSector',
  'hostSubSector',
  'province',
  'districtMunicipality',
  'localMunicipality',
]

const Mitigations = [
  'mitigationType',
  'mitigationSubType',
  'interventionStatus',
  'cdmMethodology',
  'cdmExecutiveStatus',
  'hostSector',
  'hostSubSectorPrimary',
  'hostSubSectorSecondary',
]

const Adaptations = [
  'adaptationSector',
  'adaptationPurpose',
  'interventionStatus',
  'hazardFamily',
  'hazardSubFamily',
  'hazard',
  'subHazard',
]

const vocabularyFields = {
  Projects,
  p: Projects,
  Mitigations,
  m: Mitigations,
  Adaptations,
  a: Adaptations,
}

export default vocabularyFields
