import { useContext, lazy, Suspense } from 'react'
import { context as authenticationContext } from '../../contexts/authentication'
import { context as authorizationContext } from '../../contexts/authorization'
import Header from './header'
import Wrapper from '../../components/page-wrapper'
import Loading from '../../components/loading'
import AccessDenied from '../../components/access-denied'

const ProjectForm = lazy(() => import('../../components/project-form'))

export default () => {
  const isAuthenticated = useContext(authenticationContext).authenticate()
  const { hasPermission } = useContext(authorizationContext)

  if (!isAuthenticated) {
    return <Loading />
  }

  if (!hasPermission('create-project')) {
    return <AccessDenied requiredPermission="create-project" />
  }

  return (
    <>
      <Header />
      <Wrapper>
        <Suspense fallback={<Loading />}>
          <ProjectForm />
        </Suspense>
      </Wrapper>
    </>
  )
}
