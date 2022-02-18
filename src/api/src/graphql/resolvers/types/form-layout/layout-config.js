export const generalDetails = [
  {
    'Project overview': [
      'title',
      'interventionType',
      'description',
      'implementationStatus',
      'implementingOrganization',
      'otherImplementingPartners',
      'startYear',
      'endYear',
      'link',
    ],
  },
  {
    'Project funding': [
      'fundingOrganisation',
      'fundingType',
      'fundingTypeOther',
      'actualBudget',
      'estimatedBudget',
    ],
  },
  {
    'Geographic location(s)': [
      'province',
      'districtMunicipality',
      'localMunicipality',
      'cityOrTown',
      'xy',
    ],
  },
  {
    'Project manager': [
      'projectManagerName',
      'projectManagerOrganization',
      'projectManagerPosition',
      'projectManagerEmail',
      'projectManagerTelephone',
      'projectManagerMobile',
    ],
  },
  { 'Submission status': ['__submissionStatus', '__submissionComments'] },
]

export const mitigationDetails = [
  { 'Host sector': ['hostSector', 'hostSubSectorPrimary', 'hostSubSectorSecondary'] },
  { 'Project type': ['mitigationType', 'mitigationSubType'] },
  {
    'Policy information': [
      'mitigationProgramme',
      'nationalPolicy',
      'otherNationalPolicy',
      'regionalPolicy',
      'otherRegionalPolicy',
      'primaryIntendedOutcome',
    ],
  },
  { 'Progress reports': ['fileUploads'] },
  { 'Progress calculator': ['progressData'] },
  {
    'Co-benefit information': [
      'coBenefitEnvironmental',
      'coBenefitEnvironmentalDescription',
      'coBenefitSocial',
      'coBenefitSocialDescription',
      'coBenefitEconomic',
      'coBenefitEconomicDescription',
    ],
  },
  {
    'Carbon credit information': [
      'carbonCredit',
      'carbonCreditStandard',
      'carbonCreditCdmExecutiveStatus',
      'carbonCreditCdmMethodology',
      'carbonCreditVoluntaryOrganization',
      'carbonCreditVoluntaryMethodology',
      'carbonCreditCdmProjectNumber',
    ],
  },
]

export const adaptationDetails = [
  {
    'Adaptation details': [
      'adaptationSector',
      'otherAdaptationSector',
      'nationalPolicy',
      'otherNationalPolicy',
      'target',
      'otherTarget',
      'regionalPolicy',
      'otherRegionalPolicy',
      'hazard',
      'otherHazard',
    ],
  },
  { 'Progress calculator': ['progressData'] },
  {
    'Climate impact': [
      'observedClimateChangeImpacts',
      'addressedClimateChangeImpact',
      'responseImpact',
    ],
  },
  { 'Progress reports': ['fileUploads'] },
]
