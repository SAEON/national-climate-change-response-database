import { useQuery, gql } from '@apollo/client'
import Loading from '../../components/loading'
import Header from './header'
import Render from './render'
import Wrapper from '../../components/page-wrapper'

export default ({ id }) => {
  const { error, loading, data } = useQuery(
    gql`
      query projects($ids: [Int!]) {
        projects(ids: $ids) {
          id
          title
          description
          interventionType
          link
          implementationStatus
          implementingOrganization
          fundingOrganisation
          fundingType
          actualBudget
          estimatedBudget
          province
          districtMunicipality
          localMunicipality
          yx
          projectManagerName
          projectManagerOrganization
          projectManagerPosition
          projectManagerEmail
          projectManagerTelephone
          projectManagerMobile
          validationStatus
          validationComments
          adaptation {
            id
            adaptationSector
            nationalPolicy
            regionalPolicy
            target
            hazard
            otherHazard
            observedClimateChangeImpacts
            addressedClimateChangeImpact
            responseImpact
          }
          mitigation {
            id
            hostSector
            hostSubSectorPrimary
            hostSubSectorSecondary
            mitigationType
            mitigationSubType
            mitigationProgramme
            nationalPolicy
            regionalPolicy
            primaryIntendedOutcome
            coBenefitEnvironmental
            coBenefitEnvironmentalDescription
            coBenefitSocial
            coBenefitSocialDescription
            coBenefitEconomic
            coBenefitEconomicDescription
            carbonCredit
            carbonCreditStandard
            carbonCreditCdmExecutiveStatus
            carbonCreditCdmMethodology
            carbonCreditVoluntaryOrganization
            carbonCreditVoluntaryMethodology
            progressData
            expenditureData
          }
        }
      }
    `,
    { variables: { ids: [parseInt(id, 10)] } }
  )

  if (loading) {
    return <Loading />
  }

  if (error) {
    throw error
  }

  const { mitigation, adaptation, ...project } = data.projects[0] || undefined

  if (!project) {
    throw new Error(
      `Unable to find a project with the ID ${id}. Please contact the system administrator if you think this is an error.`
    )
  }

  return (
    <>
      <Header {...project} />
      <Wrapper>
        <Render
          mitigationSections={{
            'Host sector': ['hostSector', 'hostSubSectorPrimary', 'hostSubSectorSecondary'],
            'Mitigation type': ['mitigationType', 'mitigationSubType'],
            'Policy information': [
              'mitigationProgramme',
              'nationalPolicy',
              'regionalPolicy',
              'primaryIntendedOutcome',
            ],
            'Co-benefit information': [
              'coBenefitEnvironmental',
              'coBenefitEnvironmentalDescription',
              'coBenefitSocial',
              'coBenefitSocialDescription',
              'coBenefitEconomic',
              'coBenefitEconomicDescription',
            ],
            'Progress calculator': ['progressData'],
            'Carbon credit information': [
              'carbonCredit',
              'carbonCreditStandard',
              'carbonCreditCdmExecutiveStatus',
              'carbonCreditCdmMethodology',
              'carbonCreditVoluntaryOrganization',
              'carbonCreditVoluntaryMethodology',
            ],
            'Associated research': [
              'hasResearch',
              'researchDescription',
              'researchType',
              'researchTargetAudience',
              'researchAuthor',
              'researchPaper',
            ],
          }}
          adaptationSections={{
            'Adaptation details': [
              'adaptationSector',
              'nationalPolicy',
              'regionalPolicy',
              'correspondingAction',
            ],
            'Climate impact': [
              'observedClimateChangeImpacts',
              'addressedClimateChangeImpact',
              'responseImpact',
            ],
            'Hazard details': ['hazardFamily', 'hazardSubFamily', 'hazard', 'subHazard'],
            'Associated research': [
              'hasResearch',
              'researchDescription',
              'researchType',
              'researchTargetAudience',
              'researchAuthor',
              'researchPaper',
            ],
          }}
          projectSections={{
            'Project details': [
              'title',
              'description',
              'interventionType',
              'implementationStatus',
              'implementingOrganization',
              'startYear',
              'endYear',
              'link',
            ],
            'Project funding': [
              'fundingOrganisation',
              'fundingType',
              'actualBudget',
              'estimatedBudget',
            ],
            'Geographic location(s)': [
              'province',
              'districtMunicipality',
              'localMunicipality',
              'yx',
            ],
            'Project manager': [
              'projectManagerName',
              'projectManagerOrganization',
              'projectManagerPosition',
              'projectManagerEmail',
              'projectManagerTelephone',
              'projectManagerMobile',
              'projectManagerPhysicalAddress',
              'projectManagerPostalAddress',
            ],
            'Validation status': ['validationStatus', 'validationComments'],
          }}
          project={project}
          mitigation={mitigation}
          adaptation={adaptation}
        />
      </Wrapper>
    </>
  )
}
