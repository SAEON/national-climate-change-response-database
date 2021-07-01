import { lazy, Suspense } from 'react'
import Header from './header'
import Wrapper from '../../components/page-wrapper'
import { gql, useQuery } from '@apollo/client'
import Loading from '../../components/loading'

const ProjectForm = lazy(() => import('../../components/project-form'))

export default ({ id }) => {
  const { error, loading, data } = useQuery(
    gql`
      query activeSubmission($id: ID!) {
        activeSubmission(id: $id) {
          id
          projectForm
          mitigationForm
          adaptationForm
        }
      }
    `,
    {
      variables: {
        id,
      },
    }
  )

  if (error) {
    throw new Error(
      'This submission is no longer active. Please contact an administrator if you think this message is indicative of an error'
    )
  }

  if (loading) {
    return <Loading />
  }

  const project = JSON.parse(data.activeSubmission.projectForm)
  const mitigation = JSON.parse(data.activeSubmission.mitigationForm)
  const adaptation = JSON.parse(data.activeSubmission.adaptationForm)

  return (
    <>
      <Header id={id} />
      <Wrapper>
        <Suspense fallback={<Loading />}>
          <ProjectForm submissionId={id} project={{ mitigation, adaptation, ...project }} />
        </Suspense>
      </Wrapper>
    </>
  )
}
