import { useContext } from 'react'
import { useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { gql, useMutation } from '@apollo/client'
import Loading from '../../components/loading'
import { context as authenticationContext } from '../../contexts/authentication'
import { context as authorizationContext } from '../../contexts/authorization'
import AccessDenied from '../../components/access-denied'

export default () => {
  const isAuthenticated = useContext(authenticationContext).authenticate()
  const { hasPermission } = useContext(authorizationContext)

  const [createSubmission, { data: { createSubmission: { id } = {} } = {} }] = useMutation(
    gql`
      mutation createSubmission {
        createSubmission {
          id
          isSubmitted
        }
      }
    `,
    {
      update: (cache, { data: { createSubmission: newSubmission } }) => {
        cache.modify({
          fields: {
            submissions: (existingSubmissions = []) => [...existingSubmissions, newSubmission],
          },
        })
      },
    }
  )

  useEffect(() => {
    createSubmission()
  }, [createSubmission])

  if (!isAuthenticated) {
    return <Loading />
  }

  if (!hasPermission('create-submission')) {
    return <AccessDenied requiredPermission="create-submission" />
  }

  if (id) {
    return <Navigate to={`/submissions/new/${id}`} />
  }

  return <Loading />
}
