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
        activeSubmission(id: $id)
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

  return (
    <>
      <Header id={id} />
      {loading && <Loading />}
      {data && (
        <Wrapper>
          <Suspense fallback={<Loading />}>
            <ProjectForm submissionId={id} />
          </Suspense>
        </Wrapper>
      )}
    </>
  )
}
