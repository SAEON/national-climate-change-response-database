import { gql } from '@apollo/client'

export const projectFields = gql`
  fragment projectFields on Project {
    id
    title
    description
    interventionType {
      id
      term
      tree
      root
    }
    link
    implementationStatus {
      id
      term
      tree
      root
    }
    implementingOrganization
    fundingOrganisation
    fundingType {
      id
      term
      tree
      root
    }
    actualBudget
    estimatedBudget {
      id
      term
      tree
      root
    }
    province {
      id
      term
      tree
      root
    }
    districtMunicipality {
      id
      term
      tree
      root
    }
    localMunicipality {
      id
      term
      tree
      root
    }
    yx
    projectManagerName
    projectManagerOrganization
    projectManagerPosition
    projectManagerEmail
    projectManagerTelephone
    projectManagerMobile
    validationStatus {
      id
      term
      tree
      root
    }
    validationComments
    adaptation {
      id
      fileUploads
      adaptationSector {
        id
        term
        tree
        root
      }
      nationalPolicy {
        id
        term
        tree
        root
      }
      otherNationalPolicy
      regionalPolicy {
        id
        term
        tree
        root
      }
      otherRegionalPolicy
      target {
        id
        term
        tree
        root
      }
      hazard {
        id
        term
        tree
        root
      }
      otherHazard
      observedClimateChangeImpacts
      addressedClimateChangeImpact
      responseImpact
    }
    mitigation {
      id
      fileUploads
      hostSector {
        id
        term
        tree
        root
      }
      hostSubSectorPrimary {
        id
        term
        tree
        root
      }
      hostSubSectorSecondary {
        id
        term
        tree
        root
      }
      mitigationType {
        id
        term
        tree
        root
      }
      mitigationSubType {
        id
        term
        tree
        root
      }
      mitigationProgramme {
        id
        term
        tree
        root
      }
      nationalPolicy {
        id
        term
        tree
        root
      }
      otherNationalPolicy
      regionalPolicy {
        id
        term
        tree
        root
      }
      otherRegionalPolicy
      primaryIntendedOutcome
      coBenefitEnvironmental {
        id
        term
        tree
        root
      }
      coBenefitEnvironmentalDescription
      coBenefitSocial {
        id
        term
        tree
        root
      }
      coBenefitSocialDescription
      coBenefitEconomic {
        id
        term
        tree
        root
      }
      coBenefitEconomicDescription
      carbonCredit
      carbonCreditStandard {
        id
        term
        tree
        root
      }
      carbonCreditCdmExecutiveStatus {
        id
        term
        tree
        root
      }
      carbonCreditCdmMethodology {
        id
        term
        tree
        root
      }
      carbonCreditVoluntaryOrganization {
        id
        term
        tree
        root
      }
      carbonCreditVoluntaryMethodology
      progressData
      expenditureData
    }
  }
`
