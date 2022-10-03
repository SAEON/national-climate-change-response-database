import { useContext, lazy, Suspense } from 'react'
import { useQuery, gql } from '@apollo/client'
import Loading from '../../components/loading'
import { context as authenticationContext } from '../../contexts/authentication'
import { context as authorizationContext } from '../../contexts/authorization'
import Header from './header'
import useTheme from '@mui/material/styles/useTheme'
import AccessDenied from '../../components/access-denied'
import Container from '@mui/material/Container'
import { useParams } from 'react-router-dom'

const ProjectForm = lazy(() => import('../../components/submission-form'))

const LoadProject = () => {
  const { id } = useParams()
  const theme = useTheme()
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
      <div style={{ marginTop: theme.spacing(2) }} />
      <Container style={{ minHeight: 1000 }}>
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
      </Container>
      <div style={{ marginTop: theme.spacing(2) }} />
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
