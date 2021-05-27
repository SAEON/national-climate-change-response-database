import { gql, useQuery } from '@apollo/client'
import Filters from './filters'
import Header from './header'
import Projects from './results'
import Grid from '@material-ui/core/Grid'
import Loading from '../../components/loading'
import Hidden from '@material-ui/core/Hidden'

export default () => {
  const { error, loading, data } = useQuery(
    gql`
      query projects($distinct: Boolean) {
        projects: projects {
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
          province
          districtMunicipality
          localMunicipality
          mitigations {
            id
            title
            description
            carbonCredit
            volMethodology
            goldStandard
            vcs
            yx
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
            yx
            isResearch
            interventionStatus
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

        filters: projects(distinct: $distinct) {
          interventionType
          projectStatus
          validationStatus
          fundingStatus
          estimatedBudget
          hostSector
          hostSubSector
          province
          districtMunicipality
          localMunicipality
          mitigations {
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
            adaptationSector
            adaptationPurpose
            interventionStatus
            hazardFamily
            hazardSubFamily
            hazard
            subHazard
          }
        }
      }
    `,
    {
      variables: {
        distinct: true,
      },
    }
  )

  if (loading) {
    return <Loading />
  }

  if (error) {
    throw error
  }

  const { projects, filters } = data

  console.log('filters', filters)

  return (
    <Grid container direction="row" spacing={2}>
      {/* FILTERS */}
      <Hidden smDown>
        <Grid container item md={4} spacing={1}>
          <Grid item>
            <Filters />
          </Grid>
        </Grid>
      </Hidden>

      {/* RESULTS */}
      <Grid container direction="column" item xs style={{ flexGrow: 1 }} spacing={1}>
        <Grid item>
          <Header projects={projects} MobileFilters={Filters} />
        </Grid>
        <Grid item>
          <Projects projects={projects} />
        </Grid>
      </Grid>
    </Grid>
  )
}
