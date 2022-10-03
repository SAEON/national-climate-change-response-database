import { useContext, lazy, Suspense } from 'react'
import { context as authenticationContext } from '../../contexts/authentication'
import { context as authorizationContext } from '../../contexts/authorization'
import Loading from '../../components/loading'
import AccessDenied from '../../components/access-denied'
import { useParams } from 'react-router-dom'

const LoadSubmission = lazy(() => import('./load-submission'))

export default () => {
  const { id } = useParams()
  const isAuthenticated = useContext(authenticationContext).authenticate()
  const { hasPermission } = useContext(authorizationContext)

  if (!isAuthenticated) {
    return <Loading />
  }

  if (!hasPermission('create-submission')) {
    return <AccessDenied requiredPermission="create-submission" />
  }

  return (
    <Suspense fallback={<Loading />}>
      <LoadSubmission id={id} />
    </Suspense>
  )
}
