import { useQuery, gql } from '@apollo/client'
import Loading from '../../components/loading'
import Header from './header'
import Container from '@mui/material/Container'
import Render from './render'
import useTheme from '@mui/material/styles/useTheme'
import FourO4 from '../../components/404'
import { useParams } from 'react-router-dom'

export default () => {
  const { id } = useParams()
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
          createdBy {
            id
          }
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

  if (!data.submission) {
    return (
      <>
        <div style={{ marginTop: theme.spacing(2) }} />
        <Container style={{ minHeight: 1000 }}>
          <FourO4 />
        </Container>
      </>
    )
  }

  const { mitigation, adaptation, project, submissionStatus, submissionComments, createdBy } =
    data.submission

  if (!project) {
    throw new Error(
      `Unable to find a project with the ID ${id}. Please contact the system administrator if you think this is an error.`
    )
  }

  return (
    <>
      <Header id={id} createdBy={createdBy} {...project} />
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
            'Progress reports': ['fileUploads'],
            'Progress data': ['progressData'],
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
            'Progress data': ['progressData'],
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
              'cityOrTown',
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
