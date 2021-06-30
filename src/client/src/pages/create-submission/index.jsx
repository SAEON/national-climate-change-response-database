import { useEffect } from 'react'
import { Redirect } from 'react-router-dom'
import { gql, useMutation } from '@apollo/client'
import Loading from '../../components/loading'

export default () => {
  const [createSubmission, { data: { createSubmission: id } = {} }] = useMutation(
    gql`
      mutation createSubmission {
        createSubmission
      }
    `
  )

  useEffect(() => {
    createSubmission()
  }, [createSubmission])

  if (id) {
    return <Redirect to={`/projects/submission/${id}`} />
  }

  return <Loading />
}
