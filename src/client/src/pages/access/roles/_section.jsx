import { lazy, Suspense } from 'react'
import Collapse from '../../../components/collapse'
import Loading from '../../../components/loading'
import CardContent from '@mui/material/CardContent'

const Table = lazy(() => import('./_table'))

export default ({ name, description, permissions }) => {
  return (
    <Collapse
      cardStyle={{ border: 'none' }}
      title={`${name.toUpperCase()} permissions`}
      subheader={description}
    >
      <CardContent style={{ position: 'relative' }}>
        <Suspense fallback={<Loading style={{ bottom: '0' }} />}>
          <Table permissions={permissions} />
        </Suspense>
      </CardContent>
    </Collapse>
  )
}
