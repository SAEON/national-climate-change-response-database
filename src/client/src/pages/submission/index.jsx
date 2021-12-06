import { useQuery, gql } from '@apollo/client'
import Loading from '../../components/loading'
import Header from './header'
import Container from '@mui/material/Container'
import Render from './render'
import useTheme from '@mui/material/styles/useTheme'

export default ({ id }) => {
  const theme = useTheme()
  const { error, loading, data } = useQuery(
    gql`
      query submission($id: ID!) {
        submission(id: $id) {
          id
          submissionStatus
          submissionComments
          project
          mitigation
          adaptation
          isSubmitted
          createdAt
        }
      }
    `,
    { variables: { id } }
  )

  if (loading) {
    return <Loading />
  }

  if (error) {
    throw error
  }

  const { mitigation, adaptation, project, submissionStatus, submissionComments } =
    data.submission || undefined

  if (!project) {
    throw new Error(
      `Unable to find a project with the ID ${id}. Please contact the system administrator if you think this is an error.`
    )
  }

  return (
    <>
      <Header id={id} {...project} />
      <div style={{ marginTop: theme.spacing(2) }} />
      <Container style={{ minHeight: 1000 }}>
        <Render
          submission={{ submissionStatus, submissionComments }}
          project={project}
          mitigation={mitigation}
          adaptation={adaptation}
          submissionSections={{
            'Validation status': ['submissionStatus', 'submissionComments'],
          }}
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
              'xy',
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
          }}
        />
      </Container>
      <div style={{ marginTop: theme.spacing(2) }} />
    </>
  )
}
