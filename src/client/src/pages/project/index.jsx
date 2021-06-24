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
          projectManagerPhysicalAddress
          projectManagerPostalAddress
          validationStatus
          validationComments
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

  const { mitigations, adaptations, ...project } = data.projects[0] || undefined

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
      </Wrapper>
    </>
  )
}
