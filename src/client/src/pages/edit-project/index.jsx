import { useContext, lazy, Suspense } from 'react'
import { useQuery, gql } from '@apollo/client'
import Loading from '../../components/loading'
import { context as authenticationContext } from '../../contexts/authentication'
import { context as authorizationContext } from '../../contexts/authorization'
import Header from './header'
import Wrapper from '../../components/page-wrapper'
import AccessDenied from '../../components/access-denied'
import { projectFields } from '../../lib/gql-fragments'

const ProjectForm = lazy(() => import('../../components/project-form'))

const LoadProject = ({ id }) => {
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
