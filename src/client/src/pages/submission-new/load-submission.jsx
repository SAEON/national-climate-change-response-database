import { lazy, Suspense } from 'react'
import Header from './header'
import Wrapper from '../../components/page-wrapper'
import { gql, useQuery } from '@apollo/client'
import Loading from '../../components/loading'

const ProjectForm = lazy(() => import('../../components/project-form'))

export default ({ id }) => {
  const { error, loading, data } = useQuery(
    gql`
      query submission($id: ID!, $isSubmitted: Boolean) {
        submission(id: $id, isSubmitted: $isSubmitted) {
          id
          project
          mitigation
          adaptation
        }
      }
    `,
    {
      variables: {
        isSubmitted: false,
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

  const { project, mitigation, adaptation } = data.submission

  return (
    <>
      <Header id={id} />
      <Wrapper>
        <Suspense fallback={<Loading />}>
          <ProjectForm
            submissionId={id}
            project={project}
            mitigation={mitigation}
            adaptation={adaptation}
          />
        </Suspense>
      </Wrapper>
    </>
  )
}
