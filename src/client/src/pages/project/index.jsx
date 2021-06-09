import { useQuery, gql } from '@apollo/client'
import Loading from '../../components/loading'
import Render from './render'

export default ({ id }) => {
  const { error, loading, data } = useQuery(
    gql`
      query projects($ids: [Int!]) {
        projects(ids: $ids) {
          id
          title
          description
          projectManager
          link
          startYear
          endYear
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
            energyOrEmissionsData
            energyData
            emissionsData
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
            startYear
            endYear
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

  const {
    __typename, // eslint-disable-line
    id: _id, // eslint-disable-line
    mitigations,
    adaptations,
    ...project
  } = data.projects[0] || undefined

  if (!project) {
    throw new Error(
      `Unable to find a project with the ID ${id}. Please contact the system administrator if you think this is an error.`
    )
  }

  return (
    <Render
      mitigationSections={{}}
      adaptationSections={{}}
      projectSections={{
        'Project information': [
          'title',
          'description',
          'projectManager',
          'link',
          'startYear',
          'endYear',
          'alternativeContact',
          'alternativeContactEmail',
          'leadAgent',
          'interventionType',
          'projectStatus',
        ],
        Location: ['province', 'districtMunicipality', 'localMunicipality'],
        'Review status': ['validationComments', 'validationStatus'],
        'Financial information': [
          'fundingOrganisation',
          'fundingPartner',
          'fundingStatus',
          'estimatedBudget',
          'budgetLower',
          'budgetUpper',
        ],
        'Host information': ['hostOrganisation', 'hostPartner', 'hostSector', 'hostSubSector'],
      }}
      project={project}
      mitigations={mitigations}
      adaptations={adaptations}
    />
  )
}
