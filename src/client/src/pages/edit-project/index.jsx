import { useContext, lazy, Suspense } from 'react'
import { useQuery, gql } from '@apollo/client'
import Loading from '../../components/loading'
import { context as authenticationContext } from '../../contexts/authentication'
import { context as authorizationContext } from '../../contexts/authorization'
import Header from './header'
import Wrapper from '../../components/page-wrapper'
import AccessDenied from '../../components/access-denied'

const ProjectForm = lazy(() => import('../../components/project-form'))

const LoadProject = ({ id }) => {
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

  const project = data.projects?.[0]

  if (!project) {
    throw new Error(`Error retrieving project - are you sure that project with ID ${id} exists?`)
  }

  return (
    <>
      <Header />
      <Wrapper>
        <Suspense fallback={<Loading />}>
          <ProjectForm project={project} />
        </Suspense>
      </Wrapper>
    </>
  )
}

export default ({ id }) => {
  const isAuthenticated = useContext(authenticationContext).authenticate()
  const { hasPermission } = useContext(authorizationContext)

  if (!isAuthenticated) {
    return <Loading />
  }

  if (!hasPermission('update-project')) {
    return <AccessDenied requiredPermission="update-project" />
  }

  return <LoadProject id={id} />
}
