import CssBaseline from '@material-ui/core/CssBaseline'
import { ThemeProvider } from '@material-ui/core/styles'
import theme from './theme'
import Apollo from './components/apollo'
import ClientInfoProvider from './contexts/client-info'
import AuthenticationProvider from './contexts/authentication'
import AuthorizationProvider from './contexts/authorization'
import { SnackbarProvider } from 'notistack'
import NativeExtensions from './components/native-extensions'
import DefaultApplicationNotices from './components/default-application-notices'
import ErrorBoundary from './components/error-boundary'
import CookieConsent from './components/cookie-consent'
import DetectDevice from './components/detect-device'
import Layout from './layout'

export default () => {
  return (
    <CssBaseline>
      <ThemeProvider theme={theme}>
        <ErrorBoundary>
          <DetectDevice>
            <NativeExtensions>
              <Apollo>
                <ClientInfoProvider>
                  <CookieConsent>
                    <AuthenticationProvider>
                      <AuthorizationProvider>
                        <SnackbarProvider>
                          <DefaultApplicationNotices>
                            <Layout />
                          </DefaultApplicationNotices>
                        </SnackbarProvider>
                      </AuthorizationProvider>
                    </AuthenticationProvider>
                  </CookieConsent>
                </ClientInfoProvider>
              </Apollo>
            </NativeExtensions>
          </DetectDevice>
        </ErrorBoundary>
      </ThemeProvider>
    </CssBaseline>
  )
}
