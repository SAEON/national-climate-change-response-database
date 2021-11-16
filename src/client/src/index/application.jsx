import { lazy, Suspense } from 'react'
import ErrorBoundary from '../components/error-boundary'
import ClientContextProvider from '../contexts/client-context'
import ThemeContextProvider from '../contexts/theme'
import Loading from '../components/loading'

const Render = lazy(() => import('./_render'))

export default ({ children }) => (
  <ErrorBoundary>
    <ClientContextProvider>
      <ThemeContextProvider>
        <Suspense fallback={<Loading />}>
          <Render>{children}</Render>
        </Suspense>
      </ThemeContextProvider>
    </ClientContextProvider>
  </ErrorBoundary>
)
