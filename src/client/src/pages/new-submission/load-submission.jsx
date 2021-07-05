import { lazy, Suspense } from 'react'
import Header from './header'
import Wrapper from '../../components/page-wrapper'
import { gql, useQuery } from '@apollo/client'
import Loading from '../../components/loading'

const ProjectForm = lazy(() => import('../../components/project-form'))

export default ({ id }) => {
  const { error, loading, data } = useQuery(
    gql`
      query submission($id: ID!) {
        submission(id: $id) {
          id
          project
          mitigation
          adaptation
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

  return (
    <>
      <Header id={id} />
      <Wrapper>
        <Suspense fallback={<Loading />}>
          <ProjectForm
            submissionId={id}
            project={JSON.parse(data.submission.project)}
            mitigation={JSON.parse(data.submission.mitigation)}
            adaptation={JSON.parse(data.submission.adaptation)}
          />
        </Suspense>
      </Wrapper>
    </>
  )
}
