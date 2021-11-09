import { useContext, lazy, Suspense } from 'react'
import { useQuery, gql } from '@apollo/client'
import Loading from '../../components/loading'
import { context as authenticationContext } from '../../contexts/authentication'
import { context as authorizationContext } from '../../contexts/authorization'
import Header from './header'
import Wrapper from '../../components/page-wrapper'
import AccessDenied from '../../components/access-denied'

const ProjectForm = lazy(() => import('../../components/submission-form'))

const LoadProject = ({ id }) => {
  const { hasPermission, user } = useContext(authorizationContext)

  const { error, loading, data } = useQuery(
    gql`
      query submission($id: ID!) {
        submission(id: $id) {
          id
          project
          mitigation
          adaptation
          isSubmitted
          createdAt
          createdBy {
            id
          }
          submissionStatus
          submissionComments
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

  const submission = data.submission

  if (!submission) {
    throw new Error(`Error retrieving project - are you sure that project with ID ${id} exists?`)
  }

  const {
    project,
    mitigation,
    adaptation,
    isSubmitted,
    submissionStatus: __submissionStatus,
    submissionComments: __submissionComments,
    createdBy,
  } = submission

  if (!hasPermission('update-submission')) {
    if (createdBy?.id !== user?.id) {
      return <AccessDenied requiredPermission="update-submission" />
    }
  }

  return (
    <>
      <Header />
      <Wrapper>
        <Suspense fallback={<Loading />}>
          <ProjectForm
            mode={isSubmitted ? 'edit' : undefined}
            submissionId={id}
            project={{ __submissionStatus, __submissionComments, ...project }}
            mitigation={mitigation}
            adaptation={adaptation}
            isSubmitted={isSubmitted}
          />
        </Suspense>
      </Wrapper>
    </>
  )
}

export default ({ id }) => {
  const isAuthenticated = useContext(authenticationContext).authenticate()

  if (!isAuthenticated) {
    return <Loading />
  }

  return <LoadProject id={id} />
}
