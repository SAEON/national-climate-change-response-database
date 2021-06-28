import { useQuery, gql } from '@apollo/client'
import Loading from '../../components/loading'
import Header from './header'
import Render from './render'
import Wrapper from '../../components/page-wrapper'
import { projectFields } from '../../lib/gql-fragments'

export default ({ id }) => {
  const { error, loading, data } = useQuery(
    gql`
      ${projectFields}
      query projects($ids: [Int!]) {
        projects(ids: $ids) {
          ...projectFields
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
