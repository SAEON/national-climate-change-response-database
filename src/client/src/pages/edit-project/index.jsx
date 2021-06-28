import { useQuery, gql } from '@apollo/client'
import Loading from '../../components/loading'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import useTheme from '@material-ui/core/styles/useTheme'

export default ({ id }) => {
  const theme = useTheme()
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
            correspondingNationalPolicy
            correspondingSubNationalPolicy
            correspondingAction
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
            correspondingNationalPolicy
            correspondingSubNationalPolicy
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
    <Card style={{ backgroundColor: theme.backgroundColor }} variant="outlined">
      <CardContent>
        <h1>Edit page</h1>
        <pre>{JSON.stringify(project, null, 2)}</pre>
      </CardContent>
    </Card>
  )
}
