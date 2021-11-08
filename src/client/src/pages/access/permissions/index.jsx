import { useContext, lazy, Suspense } from 'react'
import { context as accessContext } from '../context'
import Loading from '../../../components/loading'

const Render = lazy(() => import('./_render'))

export default ({ active }) => {
  const { permissions } = useContext(accessContext)

  if (!active) {
    return null
  }

  return (
    <Suspense fallback={<Loading />}>
      <Render permissions={permissions} />
    </Suspense>
  )
}
