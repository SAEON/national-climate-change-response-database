import { lazy, Suspense } from 'react'
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles'
import Loading from '../components/loading'
import theme from '../theme'

const Render = lazy(() => import('./_render'))

export default () => (
  <StyledEngineProvider injectFirst>
    <ThemeProvider theme={theme}>
      <Suspense fallback={<Loading />}>
        <Render />
      </Suspense>
    </ThemeProvider>
  </StyledEngineProvider>
)
