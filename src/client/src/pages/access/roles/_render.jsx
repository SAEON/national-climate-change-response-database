import { memo, lazy, Suspense } from 'react'
import Grid from '@mui/material/Grid'
import Loading from '../../../components/loading'

const Section = lazy(() => import('./_section'))

export default memo(({ roles }) => {
  return (
    <Grid container spacing={2}>
      {roles.map(({ name, description, permissions }) => {
        return (
          <Grid key={name} item xs={12}>
            <Suspense fallback={<Loading />}>
              <Section name={name} description={description} permissions={permissions} />
            </Suspense>
          </Grid>
        )
      })}
    </Grid>
  )
})
