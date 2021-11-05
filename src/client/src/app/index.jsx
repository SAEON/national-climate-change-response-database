import { lazy, Suspense } from 'react'
import { ThemeProvider } from '@material-ui/core/styles'
import Loading from '../components/loading'
import theme from '../theme'

const Render = lazy(() => import('./_render'))

export default () => (
  <ThemeProvider theme={theme}>
    <Suspense fallback={<Loading />}>
      <Render />
    </Suspense>
  </ThemeProvider>
)
