import { lazy, Suspense } from 'react'
import ApolloProvider from '../components/apollo'
import ErrorBoundary from '../components/error-boundary'
import ClientContextProvider from '../contexts/client-context'
import ThemeContextProvider from '../contexts/theme'
import Loading from '../components/loading'

const Render = lazy(() => import('./_render'))

export default ({ routes, children }) => (
  <ErrorBoundary>
    <ApolloProvider>
      <ClientContextProvider routes={routes}>
        <ThemeContextProvider>
          <Suspense fallback={<Loading />}>
            <Render>{children}</Render>
          </Suspense>
        </ThemeContextProvider>
      </ClientContextProvider>
    </ApolloProvider>
  </ErrorBoundary>
)
