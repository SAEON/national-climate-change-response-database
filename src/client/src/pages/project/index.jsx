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
          projectManager
          link
          startDate
          endDate
          validationComments
          fundingOrganisation
          fundingPartner
          budgetLower
          budgetUpper
          hostOrganisation
          hostPartner
          alternativeContact
          alternativeContactEmail
          leadAgent
          interventionType
          projectStatus
          validationStatus
          fundingStatus
          estimatedBudget
          hostSector
          hostSubSector
          mitigations {
            id
            title
            description
            carbonCredit
            volMethodology
            goldStandard
            vcs
            otherCarbonCreditStandard
            otherCarbonCreditStandardDescription
            cdmProjectNumber
            cdmStatus
            isResearch
            researchDescription
            researchType
            researchTargetAudience
            researchAuthor
            researchPaper
            mitigationType
            mitigationSubType
            interventionStatus
            cdmMethodology
            cdmExecutiveStatus
            hostSector
            hostSubSectorPrimary
            hostSubSectorSecondary
          }
          adaptations {
            id
            title
            description
            startDate
            endDate
            xy
            isResearch
            researchDescription
            researchType
            researchTargetAudience
            researchAuthor
            researchPaper
            adaptationSector
            adaptationPurpose
            hazardFamily
            hazardSubFamily
            hazard
            subHazard
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

  return (
    <Card style={{ backgroundColor: theme.backgroundColor }} variant="outlined">
      <CardContent>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </CardContent>
    </Card>
  )
}
