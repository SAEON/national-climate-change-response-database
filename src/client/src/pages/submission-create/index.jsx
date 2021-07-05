import { useContext } from 'react'
import { useEffect } from 'react'
import { Redirect } from 'react-router-dom'
import { gql, useMutation } from '@apollo/client'
import Loading from '../../components/loading'
import { context as authenticationContext } from '../../contexts/authentication'
import { context as authorizationContext } from '../../contexts/authorization'
import AccessDenied from '../../components/access-denied'

export default () => {
  const isAuthenticated = useContext(authenticationContext).authenticate()
  const { hasPermission } = useContext(authorizationContext)

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

  if (!isAuthenticated) {
    return <Loading />
  }

  if (!hasPermission('create-project')) {
    return <AccessDenied requiredPermission="create-project" />
  }

  if (id) {
    return <Redirect to={`/submissions/new/${id}`} />
  }

  return <Loading />
}
